import * as SPLAT from "gsplat";

// Initialisiere notwendige Elemente von der Seite
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const progressDialog = document.getElementById("progress-dialog") as HTMLDialogElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;

// Initialisiere SPLAT-Elemente für die Szene
const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

// Funktion zum Laden der Szene basierend auf der übergebenen URL
async function loadScene(url: string) {
    // Zeige den Ladebildschirm und das Canvas
    progressDialog.showModal();
    canvas.style.display = 'block';

    // Lade die Szene mit der übergebenen URL
    await SPLAT.Loader.LoadAsync(url, scene, (progress) => (progressIndicator.value = progress * 100));

    // Schließe den Ladebildschirm, sobald das Laden abgeschlossen ist
    progressDialog.close();

    // Funktion zum Anpassen der Canvas-Größe bei Fenstergrößenänderungen
    const handleResize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };

    // Animationsfunktion für das Rendering
    const frame = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(frame);
    };

    // Event Listener für Fenstergrößenänderungen
    handleResize();
    window.addEventListener("resize", handleResize);

    // Starte die Rendering-Schleife
    requestAnimationFrame(frame);
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        if (url) {
            document.getElementById('card-container')!.style.display = 'none';
            document.getElementById('back-arrow')!.style.display = 'block';
            loadScene(url);
        }
    });
});

document.getElementById('back-arrow')!.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    document.getElementById('canvas')!.style.display = 'none';
    document.getElementById('card-container')!.style.display = 'flex'; // Karten wieder anzeigen
    document.getElementById('back-arrow')!.style.display = 'none'; // Zurück-Pfeil ausblenden
    
    scene.reset();
});

