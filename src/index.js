import './index.scss';
import Controls from './logo/controls';
import Logo from './logo/logo';

const vertexShader = document.getElementById('vertexShader').textContent;
const fragmentShader = document.getElementById('fragmentShader').textContent;
const logoEl = document.querySelector('.js-zerologo');
const logo = new Logo(logoEl, { vertexShader, fragmentShader });
const controlsEl = document.querySelector('.js-options');

// should probably consider different approach so there wouldn't be unused vars
/* eslint-disable */
const controls = new Controls(controlsEl, logo);
/* eslint-enable */
