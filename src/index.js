'use strict';

import './index.scss';
import Logo from './logo/logo';
import Controls from './logo/controls';

const logoEl = document.querySelector('.js-zerologo');
const logo = new Logo(logoEl, {});
const controlsEl = document.querySelector('.js-options');
const controls = new Controls(controlsEl, logo);
