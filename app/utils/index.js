module.exports = {
	getDiffElements: (array1, array2) => {
		const arr1 = [...new Set(array1)];
		const arr2 = [...new Set(array2)];
		return arr1.filter(x => !arr2.includes(x));
	}
};
