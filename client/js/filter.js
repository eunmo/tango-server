tangoApp.filter ('hideZero', function () {
	return function (num) {
		if (num === 0)
			return '';
		return num;
	};
});
