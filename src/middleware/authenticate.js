
const authenticate = (req, _res, next) => {
    req.user = {
		id: '65068afc654849c1f17f169a',
		name: 'Anamul Haque',
		email: 'anamul@gmail.com',
		role: 'user',
	};
	next();
  };

  module.exports = authenticate;