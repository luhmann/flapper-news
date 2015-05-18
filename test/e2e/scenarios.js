describe('Flapper News App', function () {
    describe('Home', function () {
        var settings = {
            url: '/'
        };

        beforeEach(function () {
            browser.get(settings.url);
        });

        it('should redirect to index to /#/home', function () {
            browser.getLocationAbsUrl().then(function (url) {
                expect(url).toBe('/home');
            });
        });

        // This is not a good test
        it('head title should contain the correct title', function () {
            expect(browser.getTitle()).toEqual('Flapper News');
        });

        it('h1 should contain the correct title', function () {
            expect(element(by.css('.title')).getText()).toEqual('Flapper News');
        });
    });

});