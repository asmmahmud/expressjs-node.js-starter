if(process.env.NODE_ENV === 'production') {
  console.log('Production');
  module.exports = {
    'mongoUri': 'your mongodb uri',
  };
} else {
  console.log('DEV');
  module.exports = {
    'mongoUri': 'mongodb://localhost/express-starter'
  };
}