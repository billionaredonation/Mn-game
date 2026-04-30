import loadMap from './map.js';

export default async function HomeScreen() {
  const root = document.createElement('div');
  root.className = 'home-screen';

  const img = document.createElement('img');
  img.className = 'home-map';
  img.alt = 'Map';
  root.appendChild(img);

  img.src = await loadMap();
  return root;
}
