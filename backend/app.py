from flask import Flask, jsonify, url_for, request
import os, requests, ipaddress, geoip2.database
from flask_cors import CORS, cross_origin
from flask_caching import Cache
from collections import Counter
from datetime import datetime
import pandas as pd
from pandas.io.json import json_normalize
import ipaddress

app = Flask(__name__)

CORS(app)
#geoip database reader
reader = geoip2.database.Reader('./GeoLite2-City.mmdb')

#add header (user agent)
headers = {
    'User-Agent': 'Grey Noise Visualizer'
}

#cache setup
#set FLASK_ENV_CONFIG before starting the app
#dev uses simple cache and prod uses redis (docker container)
if("FLASK_ENV_CONFIG" in os.environ and os.environ['FLASK_ENV_CONFIG'] == "prod"):
    cache = Cache(app, config={
        'CACHE_TYPE': 'redis',
        'CACHE_KEY_PREFIX': 'pcache',
        'CACHE_REDIS_HOST': 'redis',
        'CACHE_REDIS_PORT': '6379',
        'CACHE_REDIS_URL': 'redis://redis:6379'
    })
else:
    cache = Cache(app,config={'CACHE_TYPE': 'simple'})

#make cache key (path and arguments)
def make_cache_key(*args, **kwargs):
    path = request.path
    args = str(hash(frozenset(request.args.items())))
    return (path + args)

#returns tag name, category, intention, and confidence for all tags
#uses the getTags function to first get all tag names
#which calls getTagData for each tag to get intention, category, and confidence

@app.route('/api/tags', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix='tags_key')
def api_get_tags():
    ''' Get all tags from grey noise'''
    tagNames = getTags()
    return jsonify({
              'tags' :  tagNames
            }) 

# returns only tag names and rearrange for angular consumption
@app.route('/api/tagnames', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix='tagsName_key')
def api_get_only_tag_names():
    ''' Get all tags from grey noise'''
        #request api for tag names
    req = requests.get('http://api.greynoise.io:8888/v1/query/list', headers=headers)
    if req.status_code == 200:
        #get json
        onlyTagNames = req.json()
        if(onlyTagNames['tags'] == "null"):
            return jsonify({
                'tags' :  "unknown"
            })
        finalData = []
        #for all tag names, rearrange for easier consumptions
        for tag in onlyTagNames['tags']:
            temp = {}
            temp['name'] = tag
            finalData.append(temp)
        #return tag names
        return jsonify({
            'tags' :  finalData
        }) 
    else:
        return {}

#returns tag instances for a specified tag
#calls getTagData to get data
@app.route('/api/tags/<tag>', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def api_get_tagData(tag):
    ''' Get tag instances (ip info) from greynoise'''

    tagData = getTagData(tag)

    return jsonify({
              'records' :  tagData
            }) 

#returns IP and location for each instances of a specified tag
#calls getTagIpGeo to get data
@app.route('/api/geo/<tag>', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def api_get_tag_geo(tag):
    ''' Get tag IPs from greynoise and use geoip2 to get lat/long of IP'''

    tagData = getTagIpGeo(tag)

    return jsonify({
              'record' :  tagData
            }) 


#returns counts for intentions and categories
@app.route('/api/stats/counts', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix='count_key')
def api_get_stats_counts():
    ''' Get tag instances from grey noise'''

    #get tag info
    tags = getTags()
    if(tags == "unknown"):
        return jsonify({
                'counts' : "unknown"
                })
    else:
        #get counts
        counts = counter_of_things(tags)

        return jsonify({
                'counts' :  counts
                }) 

#returns other tags associated with an IP
#calls getIpData to get data
@app.route('/api/ip/<ip>', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def api_get_IpData(ip):
    ''' Get tag instances (ip info) from greynoise'''

    ipData = getIpData(ip)

    return jsonify({
              'records' :  ipData
            }) 

#returns location for a specific IP
#calls getTagIpGeo to get data
@app.route('/api/geoip/<ip>', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def api_get_ip_geo(ip):
    ''' Get tag IPs from greynoise and use geoip2 to get lat/long of IP'''

    geoData = getSingleIpGeo(ip)

    return jsonify({
              'record' :  geoData
            })

#counts occurrences for intentions and categories
def counter_of_things(items):
    #count items
    intentCounter = Counter(tag['intention'] for tag in items)
    categoryCounter = Counter(tag['category'] for tag in items)

    #create dict from Counter object
    intentCounter = dict(intentCounter)
    categoryCounter = dict(categoryCounter)

    #final data dict for return data
    finalData = {}
    #count list for intents
    countListIntent = []
    #count list for categories
    countListCategory = []

    #rearrange data for easier consumption
    #append each intent to a list
    for k, v in intentCounter.items():
        countDict = {}
        countDict['name'] = k
        countDict['count'] = v
        countListIntent.append(countDict)

    #rearrange data for easier consumption
    #append each category to a list
    for k, v in categoryCounter.items():
        countDict = {}
        countDict['name'] = k
        countDict['count'] = v
        countListCategory.append(countDict)

    #create final data dict
    finalData['intention'] = countListIntent
    finalData['category'] = countListCategory
    
    return(finalData)

#
@cache.memoize(timeout=86400)
def getTagData(tag):
    #request tag instances from greynoise
    req = requests.post('http://api.greynoise.io:8888/v1/query/tag', ({'tag': tag.upper()}), headers=headers)
    if req.status_code == 200:
        allTagData = req.json()
        if allTagData['status'] == "unknown":
            return "unknown"
        finalTagData = []

        #for each tag instances
        #rearrange data
        for section in allTagData['records']:
            newTagData = {}
            newTagData['name'] = section['name']
            newTagData['category'] = section['category']
            newTagData['confidence'] = section['confidence']
            # set intention to 'Null' if empty
            if(not section['intention']):
                newTagData['intention'] = 'Unknown'
            else:
                newTagData['intention'] = section['intention']
                
            newTagData['ip'] = section['ip']
            newTagData['first_seen'] = section['first_seen'].split('T')[0]
            newTagData['last_updated'] = section['last_updated'].split('T')[0]
            newTagData['org'] = section['metadata']['org']
            newTagData['rdns'] = section['metadata']['rdns']
            newTagData['asn'] = section['metadata']['asn']
            newTagData['os'] = section['metadata']['os']
            newTagData['datacenter'] = section['metadata']['datacenter']

            finalTagData.append(newTagData)

        return finalTagData
    else:
        return {}

#
@cache.memoize(timeout=86400)
def getTags():
    #request tag names from greynoise
    req = requests.get('http://api.greynoise.io:8888/v1/query/list', headers=headers)
    if req.status_code == 200:
        allTagNames = req.json()
        if(allTagNames['tags'] == 'null'):
            return "unknown"
        finalTagData = []
        
        #for each tag, call getTagData to retrieve intent, category, and confidence
        for tag in allTagNames['tags']:
            resp = getTagData(tag)
            newTagData = {}
            #only need to get first instance because
            #all instances have same data
            newTagData['category'] = resp[0]['category']
            newTagData['name'] = resp[0]['name']
            newTagData['intention'] = resp[0]['intention']
            newTagData['confidence'] = resp[0]['confidence']
            finalTagData.append(newTagData)
        return finalTagData
    else:
        return {}
            
#get the long, lat for each IP for a specific tag
@cache.memoize(timeout=86400)
def getTagIpGeo(tag):

    tagData = getTagData(tag)
    finalTagData = []

    #for each tag instances
    #rearrange data and get long and lat
    for section in tagData:
        try:
            newTagData = {}
            newTagData['ip'] = section['ip']
            response = reader.city(section['ip'])
            #if lat or long is null, skip it 
            if(not response.location.longitude or not response.location.longitude):
                continue
            newTagData['long'] = response.location.longitude
            newTagData['lat'] = response.location.latitude
            finalTagData.append(newTagData)
        except Exception as e:
            pass

    return finalTagData

#get the long, lat for each IP for a specific IP
@cache.memoize(timeout=86400)
def getSingleIpGeo(ip):
    finalGeoData = {}
    finalGeoData['ip'] = ip
    try:
        response = reader.city(ip)
        #if lat or long is null, skip it 
        if(not response.location.longitude or not response.location.longitude):
            return "Not Found"
        finalGeoData['long'] = response.location.longitude
        finalGeoData['lat'] = response.location.latitude
    except Exception as e:
        return "Not Found"
        
    return finalGeoData
#
@cache.memoize(timeout=86400)
def getIpData(ip):
    #request tag instances from greynoise
    #first test if input is IP address
    try:
        ipaddress.ip_address(ip)
        req = requests.post('http://api.greynoise.io:8888/v1/query/ip', ({'ip': ip}), headers=headers)
    except ValueError:
        return "unknown"

    if req.status_code == 200:
        allIpData = req.json()
        if allIpData['status'] == "unknown":
            return "unknown"

        finalIpData = []

        #for each tag associated with an IP
        #rearrange data
        for section in allIpData['records']:
            newTagData = {}
            newTagData['name'] = section['name']
            newTagData['category'] = section['category']
            newTagData['confidence'] = section['confidence']
            # set intention to 'Null' if empty
            if(not section['intention']):
                newTagData['intention'] = 'Null'
            else:
                newTagData['intention'] = section['intention']
            newTagData['first_seen'] = section['first_seen'].split('T')[0]
            newTagData['last_updated'] = section['last_updated'].split('T')[0]

            finalIpData.append(newTagData)

        return finalIpData
    else:
        return {}


#source: https://github.com/phyler/greynoise
#time series calculations
@app.route('/api/stats/<tagName>', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def get_time_series_data(tagName):
    """get time series data for tag"""
    
    tagData = getTagData(tagName)
    if tagData == "unknown":
        return "unknown"
    df = pd.DataFrame(tagData)
    df['first_seen'] = pd.to_datetime(df['first_seen'], unit="ns")
    df['timestamp'] = df.first_seen.map(lambda x: x.strftime("%Y-%m-%d %H:%M:%S"))
    df['hits'] = 1
    del df['intention']
    del df['category']
    del df['confidence']

    ts = df.groupby('timestamp').sum()
    ts.index = pd.to_datetime(ts.index)
    ts = ts.resample('D').sum()
    ts.hits.fillna(0, inplace=True)
    finalData = ts.reset_index().to_json(orient='records')
    finalData.strip('\\')
    return finalData

if __name__ == "__main__":
   app.run(host='0.0.0.0', port = 8080)


