// NOTE! Do not add JavaScript code to your HTML files, rather use JavaScript files to add code to your pages.

const button = document.querySelector('button');

const control = function () {
    // Prompt the user to enter their name.
    let name = 'Edward'; //prompt('Please enter your name.');

    if (name) {
        // Store the name in localStorage.
        localStorage.setItem('name', name);

        // Get the result from localStorage.
        let message = 'Hello ' + localStorage.getItem('name');;

        // Using the <template> tag, get the template required for the result.
        const result = document.getElementById('result');

        // When using the <template> tag, you need to use the importNode() method to copy the content of the template tag.
        const resultBody = document.importNode(result.content, true);

        // Set the text content of the <p> tag to the message.
        resultBody.querySelector('p').textContent = message;

        // Append the result to the body.
        document.querySelector('body').append(resultBody);

        // Remove item from localStorage.
        localStorage.removeItem('name');
    }
}

const buttonClickHandler = () => {
    control();
}

const buttonClickHandlerEventData = (event) => {
    event.value = 'Hello World';

    // Disable the button.
    event.target.disabled = true;
    console.log(event.target);
}

/*
IMPORTANT! This is another way to add an event listener to an element. This is not the recommended way to add event listeners to elements.
//Adds a single event listener to the button. Not ideal for multiple events and it is better to use the addEventListener() method.
button.onclick = buttonClickHandler;
*/

// This has been added as an example.
const boundFunction = buttonClickHandler.bind(this);

// This will add two event listener to the button.
// Add an event listener to the button.
button.addEventListener('click', buttonClickHandler);
button.addEventListener('click', boundFunction);
button.addEventListener('click', buttonClickHandlerEventData);

setTimeout(() => {
    console.log('Removing event listener...');

    // Remove the event listener from the button.
    // It is very important to ensure that when removing an event listener, you use the same function name as the one used to add the event listener.
    // The trick is to store the function name in a variable and then use that variable to remove the event listener, so that it references the memory address of the function.
    button.removeEventListener('click', boundFunction);
    button.removeEventListener('click', buttonClickHandler);
    button.removeEventListener('click', buttonClickHandlerEventData);

    console.log('Event listener removed.');
}, 5000);
