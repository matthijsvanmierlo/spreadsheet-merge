const Handlebars = require('handlebars');
try {
  const template = Handlebars.compile("{{[firstName]}}");
  console.log(template({ "firstName": "John" }));
} catch (e) {
  console.log("Error:", e.message);
}
