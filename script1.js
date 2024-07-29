document.getElementById('play-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default anchor link behavior
    var sound = document.getElementById('click-sound');
    var brainImage = document.getElementById('brain-image');

    sound.play(); // Play the sound effect
    brainImage.classList.add('bounce'); // Add the bounce animation class

    // Redirect to the new page after the animation completes
    setTimeout(function () {
        window.location.href = "http://127.0.0.1:5500/index1.html";
    }, 1000); // Adjust the delay to match the animation duration
});
