import { JobTracker2.0Page } from './app.po';

describe('job-tracker2.0 App', () => {
  let page: JobTracker2.0Page;

  beforeEach(() => {
    page = new JobTracker2.0Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
