const interfaces = require('os').networkInterfaces();

const addresses = Object.keys(interfaces)
  .reduce((results, name) => results.concat(interfaces[name]), [])
  .filter((iface) => iface.family === 'IPv4' && !iface.internal && iface.cidr.split('/').pop() === "24")
  .map((iface) => iface.address);

  module.exports = addresses.slice(0,1);
