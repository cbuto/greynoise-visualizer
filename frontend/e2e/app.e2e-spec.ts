import { AppPage } from './app.po';

describe('GreyNoise App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('GreyNoise Visualizer');
  });

});
