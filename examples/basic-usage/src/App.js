import lng from "wpe-lightning";

export default class App extends lng.Application {
    static _template() {
        return {
            x: 0, y: 0, w: 1920, h: 1080,
            Background: {
                x: 0, y: 0, w: 1920, h: 1080,
                rect: true,
                color: 0xFF191919,
            },
            Loader: {
                x: 55, y: 65, w: 774, h: 40,
                alpha: 0,
                text: {
                    text: 'Loading',
                    textColor: 0xFF000000,
                },
            },
            LandingPage: {
                x: 55, y: 65, w: 774, h: 40,
                alpha: 0,
                text: {
                    text: 'Hello World',
                    textColor: 0xFF000000,
                },
            },
        }
    }

    splashLoader() {
        this.patch({Loader: {alpha: 1}});
    }

    startUp() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    splashLanding() {
        this.patch({Loader: {alpha: 0}, LandingPage: {alpha: 1}})
    }
}
