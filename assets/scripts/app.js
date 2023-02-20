class DOMHelper {
    static moveElement(elementId, newDestinationSelector) {
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
        element.scrollIntoView({ behavior: 'smooth' });

        // element.scrollBy({ top: 50, behavior: 'smooth' });
    }

    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class Component {
    constructor(hostElementId, insertBefore = false) {
        if (hostElementId) {
            this.hostElement = document.getElementById(hostElementId);
        } else {
            this.hostElement = document.body;
        }
        this.insertBefore = insertBefore;
    }

    render() { }

    detachTooltip() {
        if (this.element) {
            this.element.remove();
            // For older browsers you can use this instead of the line above.
            // this.element.parentElement.removeChild(this.element);
        }
    }

    attachTooltip() {
        this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
    }
}

class Tooltip extends Component {
    constructor(closeNotifierFunction, tooltipText, hostElementId) {
        // super('active-projects', true);
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.tooltipText = tooltipText;
        this.create();
    }

    closeTooltip() {
        this.detachTooltip();
        this.closeNotifier();
    }

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        // tooltipElement.textContent = this.tooltipText;
        // tooltipElement.innerHTML = '<h2>Tooltip</h2><p>' + this.tooltipText + '</p>';

        // In order to eliminate the use of HTML in our JS file we can use the template tag in the HTML file.
        const tooltipTemplate = document.getElementById('tooltip');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.tooltipText;
        tooltipElement.append(tooltipBody);

        // You can use more than one template tag in the HTML file.
        // const tooltipTemplate1 = document.getElementById('test-tag');
        // const tooltipBody1 = document.importNode(tooltipTemplate1.content, true);
        // tooltipBody1.querySelector('p').textContent = 'test';
        // tooltipElement.append(tooltipBody1);

        const hostElementPositionLeft = this.hostElement.offsetLeft;
        const hostElementPositionTop = this.hostElement.offsetTop;
        const hostElementHeight = this.hostElement.clientHeight;
        const parentElementScrolling = this.hostElement.parentElement.scrollTop;

        const tooltipPositionLeft = hostElementPositionLeft + 20;
        const tooltipPositionTop = ((hostElementPositionTop + hostElementHeight) - parentElementScrolling) - 10;

        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = tooltipPositionLeft + 'px';
        tooltipElement.style.top = tooltipPositionTop + 'px';

        tooltipElement.addEventListener('click', this.closeTooltip.bind(this));
        this.element = tooltipElement;
    }
}

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListFunction, type) {
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;

        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
    }

    showMoreInfoHandler() {
        if (this.hasActiveTooltip) return;

        const projectElement = document.getElementById(this.id);
        console.log(projectElement.dataset.extraInfo);
        const tooltipText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip(() => { this.hasActiveTooltip = false; }, tooltipText, this.id);
        tooltip.attachTooltip();
        this.hasActiveTooltip = true;
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfoButton = projectItemElement.querySelector('button:first-of-type');
        moreInfoButton.addEventListener('click', this.showMoreInfoHandler.bind(this));

    }

    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchButton = projectItemElement.querySelector('button:last-of-type');
        switchButton = DOMHelper.clearEventListeners(switchButton);
        switchButton.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchButton.addEventListener('click', this.updateProjectListHandler.bind(null, this.id));
    }

    update(updateProjectListFunction, type) {
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectSwitchButton(type);
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;

        // CSS selector for all the items in the HTML.
        const projectItems = document.querySelectorAll(`#${type}-projects li`);

        // Loop through all the items and create a new ProjectItem object.
        for (const projectItem of projectItems) {
            this.projects.push(new ProjectItem(projectItem.id, this.switchProject.bind(this), this.type));
        }
    }

    setSwitchHandlerFunction(switchFunction) {
        this.switchHandler = switchFunction;
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projectId) {
        this.switchHandler(this.projects.find(p => p.id === projectId));

        // Filter the projects array and return the array with all the projects that do not match the projectId.
        this.projects = this.projects.filter(p => p.id !== projectId);
    }
}

class App {
    timer = function () { };

    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');

        activeProjectList.setSwitchHandlerFunction(finishedProjectList.addProject.bind(finishedProjectList));
        finishedProjectList.setSwitchHandlerFunction(activeProjectList.addProject.bind(activeProjectList));

        // this.loadScripts();
        // If you want to pass arguments to the loadScripts method you can pass them as an object as shown below.
        this.timer = setTimeout(this.loadScripts, 2000, { once: true });
    }

    static loadScripts(once = false) {
        if (once) {
            // Adding scripts dynamically using JS.
            const script = document.createElement('script');
            script.src = 'https://use.fontawesome.com/releases/v5.15.3/js/all.js';
            script.defer = true;
            document.head.append(script);

            const analytics = document.createElement('script');
            analytics.src = 'assets/scripts/analytics.js';
            analytics.defer = true;
            document.head.append(analytics);

            clearTimeout(this.timer);
        }
    }
}

App.init();

navigator.geolocation.getCurrentPosition((data) => {console.log(data)});