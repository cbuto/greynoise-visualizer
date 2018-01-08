from flask import Flask, jsonify, url_for, request
import os, requests, ipaddress
from flask_cors import CORS, cross_origin
from flask_caching import Cache
from collections import Counter
from datetime import datetime
import pandas as pd
from pandas.io.json import json_normalize

app = Flask(__name__)
CORS(app)

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
    #only return ip , first seen, last updated
    return jsonify({
              'tags' :  tagNames
            }) 

# returns only tag names and rearrange for angular consumption
@app.route('/api/tagnames', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix='tagsName_key')
def api_get_only_tag_names():
    ''' Get all tags from grey noise'''
    try:
        #request api for tag names
        req = requests.get('http://api.greynoise.io:8888/v1/query/list')
        if req.status_code == 200:
            #get json
            onlyTagNames = req.json()

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
    # fix this
    except Exception as e:
        return e

#returns tag instances for a specified tag
#calls getTagData to get data
@app.route('/api/tags/<tag>', methods = ['POST'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def api_get_tagData(tag):
    ''' Get tag instances (ip info) from greynoise'''

    tagData = getTagData(tag)

    return jsonify({
              'records' :  tagData
            }) 

#returns counts for intentions and categories
@app.route('/api/stats/counts', methods = ['GET'])
@cache.cached(timeout=86400, key_prefix='count_key')
def api_get_stats_counts():
    ''' Get tag instances from grey noise'''

    #get tag info
    tags = getTags()
    #get counts
    counts = counter_of_things(tags)

    return jsonify({
              'counts' :  counts
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
    try:
        #request tag instances from greynoise
        req = requests.post('http://api.greynoise.io:8888/v1/query/tag', ({'tag': tag.upper()}))
        if req.status_code == 200:
            allTagData = req.json()
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
                    newTagData['intention'] = 'Null'
                else:
                    newTagData['intention'] = section['intention']

                newTagData['ip'] = section['ip']
                newTagData['first_seen'] = section['first_seen']
                newTagData['last_updated'] = section['last_updated']
                finalTagData.append(newTagData)

            return finalTagData
        else:

            return {}
            
    except Exception as e:
        return e 

#
@cache.memoize(timeout=86400)
def getTags():
    try:
        #request tag names from greynoise
        req = requests.get('http://api.greynoise.io:8888/v1/query/list')
        if req.status_code == 200:
            allTagNames = req.json()
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
            
    except Exception as e:
        return e 

#source: https://github.com/phyler/greynoise
#time series calculations
@app.route('/api/stats/<tagName>', methods = ['POST'])
@cache.cached(timeout=86400, key_prefix=make_cache_key)
def get_time_series_data(tagName):
    """get time series data for tag"""
    tagData = getTagData(tagName)
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


