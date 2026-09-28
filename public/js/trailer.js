(function () {
    "use strict";

    var modal = document.getElementById("trailerModal");

    if (!modal) return;

    var frame = document.getElementById("trailerFrame");
    var loading = document.getElementById("trailerLoading");
    var errorBox = document.getElementById("trailerError");
    var title = document.getElementById("trailerModalTitle");
    var lastTrigger = null;
    var requestId = 0;

    function setLoading() {
        loading.hidden = false;
        errorBox.hidden = true;
        frame.hidden = true;
        frame.src = "about:blank";
    }

    function showError(message) {
        loading.hidden = true;
        frame.hidden = true;
        frame.src = "about:blank";
        errorBox.hidden = false;
        errorBox.textContent = message || "Trailer is unavailable for this movie.";
    }

    function openModal(trigger) {
        var movieId = trigger.getAttribute("data-movie-id");
        var movieTitle = trigger.getAttribute("data-movie-title") || "Movie";

        if (!movieId) return;

        lastTrigger = trigger;
        modal.hidden = false;
        document.body.classList.add("trailer-modal-open");
        title.textContent = movieTitle + " trailer";
        setLoading();

        var currentRequest = ++requestId;
        var loadTimer = null;

        function finishLoading() {
            if (currentRequest !== requestId || modal.hidden) return;

            if (loadTimer) {
                clearTimeout(loadTimer);
                loadTimer = null;
            }
            loading.hidden = true;
        }

        fetch("/movie/" + encodeURIComponent(movieId) + "/trailer", {
            headers: {
                "Accept": "application/json"
            }
        })
            .then(function (response) {
                return response.json().then(function (data) {
                    if (!response.ok) {
                        throw new Error(data.error || "Trailer is unavailable for this movie.");
                    }

                    return data;
                });
            })
            .then(function (data) {
                if (currentRequest !== requestId || modal.hidden) return;

                if (!data.embedUrl) {
                    throw new Error("Trailer is unavailable for this movie.");
                }

                var separator = data.embedUrl.indexOf("?") === -1 ? "?" : "&";
                var embedUrl = data.embedUrl + separator + "autoplay=1&rel=0";

                frame.onload = finishLoading;
                frame.hidden = false;
                frame.src = embedUrl;
                errorBox.hidden = true;
                loading.hidden = false;
                loadTimer = setTimeout(finishLoading, 6000);
            })
            .catch(function (err) {
                if (currentRequest !== requestId || modal.hidden) return;

                if (loadTimer) {
                    clearTimeout(loadTimer);
                    loadTimer = null;
                }
                showError(err && err.message ? err.message : "Trailer is unavailable for this movie.");
            });
    }

    function closeModal() {
        requestId += 1;
        modal.hidden = true;
        document.body.classList.remove("trailer-modal-open");
        frame.hidden = true;
        frame.src = "about:blank";
        loading.hidden = true;
        errorBox.hidden = true;

        if (lastTrigger) {
            lastTrigger.focus();
            lastTrigger = null;
        }
    }

    document.addEventListener("click", function (event) {
        var trigger = event.target.closest(".trailer-trigger");

        if (trigger) {
            event.preventDefault();
            openModal(trigger);
            return;
        }

        if (event.target.closest("[data-trailer-close]")) {
            event.preventDefault();
            closeModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
})();
