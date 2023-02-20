class App {
    static init() {
        // If rootElement returns null, check to make sure that the defer attribute is set on the script tag of the html file.
        const rootElement = document.getElementById('main-box');

        // getBoundingClientRect() returns the size of an element and its position relative to the viewport.
        console.log(rootElement.getBoundingClientRect());

        console.log(rootElement.scrollHeight);

        console.log(window.innerWidth);
        console.log(document.documentElement.clientWidth);
    }
}

App.init();