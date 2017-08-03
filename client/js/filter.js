tangoApp.filter('hideZero', function () {
	return function (num) {
		if (num === 0)
			return '';
		return num;
	};
});

tangoApp.filter('fullLanguage', function () {
	return function (lang) {
		switch (lang) {
			case 'J':
				return '日本語';

			case 'F':
				return 'Français';

			case 'E':
				return 'English';
		}

		return lang;
	};
});
