'use strict';

import style from './_controls.scss';
import template from './controls.view.html';

import {randomRange} from './utils';

class Controls {
  constructor(root, logo) {
    this.root = root;
    this.logo = logo;

    const range = document.createRange();
    this.element = range.createContextualFragment(template).querySelector('.js-controls');

    this.initMenu();
    this.attachControls();
    this.attachToDom();
  }

  attachToDom() {
    this.root.appendChild(this.element);
  }

  initMenu() {
    this.element.addEventListener('submit', (event) => {
      event.preventDefault();
      window.alert(JSON.stringify(this.logo.cfg));
    });
    this.element.querySelector('.js-controls-header').addEventListener('click', () => {
      this.element.classList.toggle('controls__closed');
    });
  }

  _setValue(name, cb) {
    return (event) => {
      this.logo.cfg[name] = +event.target.value;
      if(cb) cb();
    };
  }

  _setAttribute(name, aName, isFree = false) {
    const geometry = isFree ? this.logo.freeGeometry : this.logo.bufferedGeometry;
    return this._setValue(name, () => {
      const minName = `min${name.substring(3)}`;
      const maxName = `max${name.substring(3)}`;
      const values = geometry.attributes[aName].array;
      for(let i = 0, l = values.length; i < l; i++) {
        values[i] = randomRange(this.logo.cfg[minName], this.logo.cfg[maxName]);
      }
      geometry.attributes[aName].needsUpdate = true;
    });
  }

  attachControls() {
    this.element.querySelector('#camera')
      .addEventListener('change', this._setValue('cameraHeight', this.logo.onResize.bind(this.logo)));
    this.element.querySelector('#brushsize').addEventListener('change', this._setValue('radius'));
    this.element.querySelector('#minparticlesize')
      .addEventListener('change', this._setAttribute('minParticleSize', 'a_Size'));
    this.element.querySelector('#maxparticlesize')
      .addEventListener('change', this._setAttribute('maxParticleSize', 'a_Size'));
    this.element.querySelector('#minparticlealpha')
      .addEventListener('change', this._setAttribute('minParticleAlpha', 'a_Alpha'));
    this.element.querySelector('#maxparticlealpha')
      .addEventListener('change', this._setAttribute('maxParticleAlpha', 'a_Alpha'));
    this.element.querySelector('#minframe').addEventListener('change', this._setValue('minFrame'));
    this.element.querySelector('#maxframe').addEventListener('change', this._setValue('maxFrame'));
    this.element.querySelector('#minbrownspeed').addEventListener('change', this._setValue('minBrownSpeed'));
    this.element.querySelector('#maxbrownspeed').addEventListener('change', this._setValue('maxBrownSpeed'));
    this.element.querySelector('#minbrownradius').addEventListener('change', this._setValue('minBrownRadius'));
    this.element.querySelector('#maxbrownradius').addEventListener('change', this._setValue('maxBrownRadius'));
    this.element.querySelector('#initialradius').addEventListener('change', this._setValue('initRadius'));
    this.element.querySelector('#freeamount').addEventListener('change', this._setValue('freeAmount', () => {
      this.logo.scene.remove(this.logo.scene.getObjectByName('free.particles'));
      this.logo.addFreeParticles();
    }));
    this.element.querySelector('#minfreesize')
      .addEventListener('change', this._setAttribute('minFreeSize', 'a_Size', true));
    this.element.querySelector('#maxfreesize')
      .addEventListener('change', this._setAttribute('maxFreeSize', 'a_Size', true));
    this.element.querySelector('#minfreealpha')
      .addEventListener('change', this._setAttribute('minFreeAlpha', 'a_Alpha', true));
    this.element.querySelector('#maxfreealpha')
      .addEventListener('change', this._setAttribute('maxFreeAlpha', 'a_Alpha', true));
    this.element.querySelector('#minfreeframe').addEventListener('change', this._setValue('minFreeFrame'));
    this.element.querySelector('#maxfreeframe').addEventListener('change', this._setValue('maxFreeFrame'));
    this.element.querySelector('#minfreespeed').addEventListener('change', this._setValue('minFreeSpeed'));
    this.element.querySelector('#maxfreespeed').addEventListener('change', this._setValue('maxFreeSpeed'));

    this.element.querySelector('.js-controls-restart').addEventListener('click', () => this.logo.onReset());
  }
}

export default Controls;
