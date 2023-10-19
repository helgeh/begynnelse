$(function () {

	const config = {};
	config.isLocalhost = location.host.indexOf('localhost:') >= 0;
	config.server = '//' + (config.isLocalhost ? location.host : 'jelgue.net/ferie-igjen');
	config.fetchUrl = `${config.server}/get_images.php`;

	const util = {
		rand: (tot) => Math.floor(Math.random() * (tot - 1)),
		shuffle: (array) => {
			var a, m = array.length, t, i;
			a = array.slice(0);
			while (m) {
				i = Math.floor(Math.random() * m--);
				t = a[m];
				a[m] = a[i];
				a[i] = t;
			}
			return a;
		},
		animateElement: (selector, method, args) => {
			return new Promise((resolve, reject) => {
				$(selector)[method](...args, resolve);
			});
		}
	};

	const thirdParty = {
		loadParticles: (elementId, configPath) => {
			return new Promise((resolve, reject) => {
				particlesJS.load(elementId, configPath, resolve);
			});
		}
	};

	class Store {

		constructor(config, util) {
			this.config = config;
			this.util = util;
			this.imagesOrig = [];
			this.reset();
		}

		loadImages() {
			return fetch(this.config.fetchUrl)
				.then(response => response.json())
				.then(json => {
					this.imagesOrig = json;
					this.reset();
				});
		}

		getNextImage() {
			const src = `${this.config.server}/images/${this.images[this.counter++]}`;
			if (this.isFinished()) {
				this.reset();
			}
			return src;
		}

		reset() {
			this.images = this.util.shuffle(this.imagesOrig);
			this.counter = this.util.rand(this.images.length);
		}

		isFinished() {
			return this.counter >= this.images.length;
		}
	};

	class TimeManager extends EventTarget {

		constructor(dateStr, unit) {
			super();
			this.dateStr = dateStr;
			this.unit = unit;
			this.finished = false;
		}

		updateTime() {
			return this.getTimeLeft().then(duration => {
				const timeLeft = this.getTimeAs(duration, this.unit);
				this.dispatchEvent(new CustomEvent('timeupdate', {detail:{timeLeft}}));
				return timeLeft;
			}).catch((err) => {
				this.finished = true;
				this.dispatchEvent(new CustomEvent('finished'))
			});
		}

		getTimeLeft() {
			return new Promise((resolve, reject) => {
				const endDate = moment(this.dateStr);
				const duration = moment.duration(endDate.diff(moment()));
				if (duration.asHours() > 0) {
					resolve(duration);
				}
				else {
					reject();
				}
			});
		}

		toggleUnits() {
			this.unit = (this.unit === 'hour' ? 'day' : 'hour');
			this.updateTime();
		}

		getTimeAs(duration, unit) {
			if (unit === 'day') {
				return duration.asDays();
			}
			return duration.asHours();
		}

		getUnit() {
			return this.unit;
		}

		isFinished() {
			return this.finished;
		}

	}

	class App {

		constructor(store, util, thirdParty, dateStr, interval) {
			if (!store)
				throw new Error('Parameter missing');
			this.store = store;
			this.util = util;
			this.time = new TimeManager(dateStr, 'hour');
			this.time.addEventListener('timeupdate', (e) => this.onTimeUpdate(e));
			this.time.addEventListener('finished', (e) => this.onTimeFinished(e));
			this.thirdParty = thirdParty;
			this.backdropInterval = interval;
			this.finished = false;
		}

		onTimeUpdate(e) {
			const timeLeft = e.detail.timeLeft;
			const unit = this.translateUnit(this.time.getUnit(), timeLeft);
			$('.output').text(Math.floor(timeLeft));
			$('.unit').text(unit);
		}

		translateUnit(unit, timeLeft) {
			const isSingle = Math.floor(timeLeft) === 1;
			if (unit === 'hour') {
					return 'time' + (isSingle ? '' : 'r');
			}
			return 'dag' + (isSingle ? '' : 'er');
		}

		onTimeFinished(e) {
			$('.timeleft').html('Tilbake til jobb <span class="output">&nbsp; :\'(</span>');
			util.animateElement('#particles-js', 'fadeTo', [1500, 0]);
		}

		start() {
			this.store.loadImages()
			.then(() => this.loadBackground($('.backdrop')))
			.then(() => this.util.animateElement('.backdrop', 'fadeIn', [500]))
			.then(() => this.util.animateElement('#loading', 'fadeOut', [200]))
			.then(() => this.time.updateTime())
			.then(() => {
				this.runTimer();
				return this.util.animateElement('.timeleft', 'fadeIn', [2500]);
			})
			.then(() => this.thirdParty.loadParticles('particles-js', 'js/particlesjs-config.json'))
			.then(() => this.util.animateElement('#particles-js', 'fadeTo', [1500, 1]));
		}

		toggleUnits() {
			this.time.toggleUnits();
		}

		loadBackground($elem) {
			return new Promise((resolve, reject) => {
				$elem.on('load', () => {
					$elem.off('load');
					resolve();
				});
				$elem.attr('src', this.store.getNextImage());
			});
		}

		runTimer() {
			let t = setTimeout(() => {
				if (t) {
					clearTimeout(t);
					t = null;
				}
				this.time.updateTime().then(() => {
					this.loadBackground($('.backdrop'));
					if (!this.time.isFinished()) {
						this.runTimer();
					}
				});
			}, this.backdropInterval);
		}
	};

	const store = new Store(config, util);
	const vacationEnds = '2023-10-15T23';
	const updateInterval = 1000 * 60;
	const app = new App(store, util, thirdParty, vacationEnds, updateInterval);
	app.start();
	$('.output, .unit').on('click', () => app.toggleUnits());

});
