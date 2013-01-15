if (Meteor.isClient){
  var canvas, c;
  var w = 750, h = 750;
  Meteor.startup(function () {
    canvas = d3.select("#map").insert("canvas", '.container')
      .attr('width', w)
      .attr('height', h)
    c = canvas.node().getContext("2d");
  var l = "albers "
        + "azimuthalEqualArea "
        + "azimuthalEquidistant "
        + "equirectangular "
        + "gnomonic "
        + "mercator "
        + "orthographic "
        + "stereographic "
        + "aitoff "
        + "albers "
        + "armadillo "
        + "august "
        + "azimuthalEqualArea "
        + "azimuthalEquidistant "
        + "baker "
        + "berghaus "
        + "boggs "
        + "bonne "
        + "bromley "
        + "collignon "
        + "conicConformal "
        + "conicEquidistant "
        + "craig "
        + "craster "
        + "cylindricalEqualArea "
        + "eckert1 "
        + "eckert2 "
        + "eckert3 "
        + "eckert4 "
        + "eckert5 "
        + "eckert6 "
        + "eisenlohr "
        + "equirectangular "
        + "gnomonic "
        + "gringorten "
        + "guyou "
        + "hammer "
        + "hammerRetroazimuthal "
        + "healpix "
        + "hill "
        + "homolosine "
        + "kavrayskiy7 "
        + "lagrange "
        + "larrivee "
        + "laskowski "
        + "littrow "
        + "loximuthal "
        + "mercator "
        + "miller "
        + "mollweide "
        + "mtFlatPolarParabolic "
        + "mtFlatPolarQuartic "
        + "mtFlatPolarSinusoidal "
        + "naturalEarth "
        + "nellHammer "
        + "orthographic "
        + "peirceQuincuncial "
        + "polyconic "
        + "robinson "
        + "satellite "
        + "sinusoidal "
        + "sinuMollweide "
        + "stereographic "
        + "vanDerGrinten "
        + "vanDerGrinten4 "
        + "wagner4 "
        + "wagner6 "
        + "wagner7 "
        + "wiechel "
        + "winkel3 ";
  l = l.split(' ');

  var count = -1;
  var projection = d3.geo.orthographic()
        .scale(248)
        .clipAngle(95);

  var path = d3.geo.path()
        .projection(projection)
        .context(c);

  function run(world, names) {
    var globe = {type: "Sphere"}, land = topojson.object(world, world.objects.land);
    var countries = topojson.object(world, world.objects.countries).geometries;
    var borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a.id !== b.id; })
    var i = -1, n = countries.length;
    var border = "steelblue", world_border = "steelblue";
    var selected = "red", country = "#333";
    countries.forEach(function(d) { d.name = names.filter(function(n) { return d.id == n.id; })[0].name; });
    countries.sort(function(a, b) { return a.name.localeCompare(b.name); });

    window.next = function(i) {
       if (! i) i = ~~(Math.random() * countries.length);
      d3.transition()
        .duration(500)
        .each("start", function() {
          Session.set('answer', countries[i].name);
          console.log(countries[i].name)
        })
        .tween("rotate", function() {
          var p = d3.geo.centroid(countries[i]),
              r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
          return function(t) {
            projection.rotate(r(t));
            c.clearRect(0, 0, w, h);
//            c.fillStyle = world_border, c.lineWidth = 2, c.beginPath(), path(globe), c.fill();
            c.fillStyle = country, c.beginPath(), path(land), c.fill();
            c.fillStyle = selected, c.beginPath(), path(countries[i]), c.fill();
            c.strokeStyle = border, c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
            c.strokeStyle = world_border, c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
          };
        })
    }

    d3.select('canvas').on('contextmenu', function () {
      d3.event.preventDefault();
      var k=  l[(count = count+1)];
      projection = d3.geo[k]().scale(248).clipAngle(87);
      path = d3.geo.path().projection(projection).context(c); 
      window.next();
    });
  }
  run(JSON.parse(data_world), data_names)
  });
}