// Get a HyperCat in JSON and tranlate it into RDF
function getHypercat(cat) {
  var xmlhttp = new XMLHttpRequest();
  var url = cat;

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var hypercatJSON = JSON.parse(xmlhttp.responseText);
      // translate JSON Hypercat Catalogue into RDF
      turtle_text = Hypercat_JSON_to_RDF(url, hypercatJSON);
      // Update Html
     document.getElementById("cat-rdf").innerHTML = turtle_text;
    }
  };

  xmlhttp.open("GET", url, true, null, null);
  xmlhttp.send();
}

// mapping: JSON rel -> rdfRel: RDF rel -> rdfValFunc: Call back function for type processing of RDF val
var hyperCatRels = {
  // Hypercat core
    "urn:X-hypercat:rels:hasDescription:en":
         {"rdfRel":'"https://www.w3.org/2000/01/rdf-schema#comment"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + '"@language" : "en",' + "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "urn:X-hypercat:rels:supportsSearch":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#supportsSearch"',
          "rdfValFunc":formatIDURI2},
    "urn:X-hypercat:rels:isContentType":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#isContentType"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-hypercat:rels:hasHomepage":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#hasHomepage"',
          "rdfValFunc":formatLiteralID('')},
    "urn:X-hypercat:rels:containsContentType":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#containsContentType"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-hypercat:rels:hasLicense":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#hasLicense"',
          "rdfValFunc":formatLiteralID('')},
    "urn:X-hypercat:rels:acquireCredential":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#acquireCredential"',
          "rdfValFunc":formatLiteralID('')},
    "urn:X-hypercat:rels:eventSource":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#eventSource"',
          "rdfValFunc":formatLiteralID('')},
    "urn:X-hypercat:rels:hasRobotstxt":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#hasRobotstxt"',
          "rdfValFunc":formatLiteralID('')},
    "urn:X-hypercat:rels:accessHint":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#accessHint"',
          "rdfValFunc":formatLiteralID('')},
    "urn:X-hypercat:rels:lastUpdated":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#lastUpdated"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +'"@type":"http://www.w3.org/2001/XMLSchema#dateTime",' + "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "http://www.w3.org/2003/01/geo/wgs84_pos#lat":
         {"rdfRel":'"http://www.w3.org/2003/01/geo/wgs84_pos#lat"',
          "rdfValFunc":formatLiteral('')},
    "http://www.w3.org/2003/01/geo/wgs84_pos#long":
         {"rdfRel":'"http://www.w3.org/2003/01/geo/wgs84_pos#long"',
          "rdfValFunc":formatLiteral('')},
    "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":
         {"rdfRel":'"@type"',
          "rdfValFunc":formatURITYPE},
    "http://portal.bt-hypercat.com/ontologies/hypercat#hasItem":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/hypercat#hasItem"',
          "rdfValFunc":formatIDURI},
  // Hypercat BT Data Hub
  // Class: Feed
    "urn:X-bt:rels:feedId":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_id"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedCreator":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_creator"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedUpdated":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_updated"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +'"@type":"http://www.w3.org/2001/XMLSchema#dateTime",' + "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "urn:X-bt:rels:feedTitle":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_title"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedUrl":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_url"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+'"@type":"http://www.w3.org/2001/XMLSchema#anyURI",'+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "urn:X-bt:rels:feedStatus":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_status"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedPrivate":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_private"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedDescription":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_description"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedIcon":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_icon"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+'"@type":"http://www.w3.org/2001/XMLSchema#anyURI",'+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "urn:X-bt:rels:feedWebsite":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_website"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+'"@type":"http://www.w3.org/2001/XMLSchema#anyURI",'+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "urn:X-bt:rels:feedEmail":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_email"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedTag":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_tag"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedLocationName":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_location_name"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedExposure":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_exposure"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedDomain":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_domain"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedDisposition":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_disposition"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:feedTheGeom":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#feed_the_geom"',
          "rdfValFunc":formatLiteral('')},
  // Class: EventFeed
    "urn:X-bt:rels:hasEventStream":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#hasEventStream"',
          "rdfValFunc":formatLiteralID('')},
  // Class: SensorFeed
    "urn:X-bt:rels:hasSensorStream":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#hasSensorStream"',
          "rdfValFunc":formatLiteralID('')},
  // Class: Datastream
    "urn:X-bt:rels:datastreamId":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_id"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:datastreamTag":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_tag"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:datastreamCurrentTime":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_current_time"',
          "rdfValFunc":formatLiteralValue("{"+ "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +'"@type":"http://www.w3.org/2001/XMLSchema#dateTime",' + "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")},
    "urn:X-bt:rels:datastreamCurrentValue":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_current_value"',
          "rdfValFunc":formatLiteral('')},
  // Class: EventStream
    "urn:X-bt:rels:belongsToEventFeed":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#belongsToEventFeed"',
          "rdfValFunc":formatLiteralID('')},
  // Class: SensorStream
    "urn:X-bt:rels:datastreamMaxValue":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_max_value"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:datastreamMinValue":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_min_value"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:datastreamUnitSymbol":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_unit_symbol"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:datastreamUnitType":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_unit_type"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:datastreamUnitText":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#datastream_unit_text"',
          "rdfValFunc":formatLiteral('')},
    "urn:X-bt:rels:belongsToSensorFeed":
         {"rdfRel":'"http://portal.bt-hypercat.com/ontologies/bt-hypercat#belongsToSensorFeed"',
          "rdfValFunc":formatLiteralID('')},
  };
  
  // mapping: JSON val -> rdfVal: RDF val
  var hyperCatVals = {
  // Hypercat core
    "urn:X-hypercat:search:simple":
         {"rdfVal":
          '"http://portal.bt-hypercat.com/ontologies/hypercat#SimpleSearch"'},
    "urn:X-hypercat:search:geobound":
         {"rdfVal":
          '"http://portal.bt-hypercat.com/ontologies/hypercat#GeoboundSearch"'},
    "urn:X-hypercat:search:lexrange":
         {"rdfVal":
         '"http://portal.bt-hypercat.com/ontologies/hypercat#LexrangeSearch"'},
    "urn:X-hypercat:search:multi":
         {"rdfVal":
         '"http://portal.bt-hypercat.com/ontologies/hypercat#MultiSearch"'},
    "urn:X-hypercat:search:prefix":
         {"rdfVal":
         '"http://portal.bt-hypercat.com/ontologies/hypercat#PrefixSearch"'},
    "urn:X-hypercat:search:semantic":
         {"rdfVal":
         '"http://portal.bt-hypercat.com/ontologies/hypercat#SemanticSearch"'},
  };


// Return the RDF equivalent of a JSON HyperCat Catalogue
// url: the URI of the HyperCat Catalogue
// data: HyperCat Catalogue as JSON object
function Hypercat_JSON_to_RDF(url, data) {

  var turtle_text = '';

  const turtleMap = new Map();
  
  // translate catalogue metadata
  for (i = 0; i < data['catalogue-metadata'].length; i += 1) {
    var meta = data['catalogue-metadata'][i];

    // set new catalogue's MIME type to N-Triples
    if (meta.rel === "urn:X-hypercat:rels:isContentType" &&
	    meta.val === "application/vnd.hypercat.catalogue+json") {
      meta.val = "application/ld+json";
    }

    JSON_to_MAP(turtleMap,url,meta.rel,meta.val);    
  }

  // translate items
  for (i = 0; i < data.items.length; i += 1) {
    var href = data.items[i].href;

    JSON_to_MAP(turtleMap,url, '"http://portal.bt-hypercat.com/ontologies/hypercat#hasItem"', href);

    for (j = 0; j < data.items[i]['item-metadata'].length; j += 1) {
      var meta = data.items[i]['item-metadata'][j];     
      JSON_to_MAP(turtleMap,href, meta.rel, meta.val);
    }
  }

    var turtleMapsize = Array.from(turtleMap);
    document.write("["+"<br/>" +"&nbsp;{" + "<br />" +'"@graph" : [ ' + "<br />");
    
    var turtleMapCounter = 0;
    var turtleMapSize = turtleMap.size;    
    turtleMap.forEach((turtlevalue, turtlekey, turtleMap) => {
      turtleMapCounter++;

      const predMap = turtlevalue;
      document.write("&nbsp;&nbsp;&nbsp;&nbsp;" + "{" + "<br/>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + turtlekey);

      if (turtleMapCounter <= turtleMapSize){
        document.write(","+ "</br>");
      }  

      var predMapCounter =0;
      var predMapSize = predMap.size; 
      predMap.forEach((predvalue, predkey, predMap) => {
        predMapCounter++;

        if (predkey === '"http://portal.bt-hypercat.com/ontologies/hypercat#supportsSearch"'){
          document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
          '"http://portal.bt-hypercat.com/ontologies/hypercat#hasItem"'+ ": ["+  "<br />"    
          )
          var turtleKeyCounter =0;
          var turtleKeyMap = turtleMap.size;
          for (var key of turtleMap.keys()) {
            turtleKeyCounter++;
            if (turtleKeyCounter > 1){
            document.write("&nbsp;&nbsp;&nbsp;&nbsp;" +"{"+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ "<br />" +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ key + "<br />"
           )
           if (turtleKeyCounter < turtleKeyMap){
            document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},"+ "</br>");
          }else{
            document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}");
          } 
          }};
    
           if (turtleMap.size > 1 ){ 
            document.write("</br>&nbsp;&nbsp;&nbsp;]," + "<br />");
           }
          }

        document.write("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + predkey + " :");
        
        const objSet = predvalue;


        if (objSet.size > 1 ){ 
          document.write("&nbsp;&nbsp;" +"[" + "<br/>");
        }

        var objSetCounter = 0;
        var objSetSize = objSet.size;        
        objSet.forEach((value1, value2, objSet) => {
          objSetCounter++;

          if (objSet.size == 1){
            document.write("&nbsp;&nbsp;&nbsp;[" + value1 + "]");
          }else{ 
          document.write("&nbsp;&nbsp;&nbsp;" + value1);
          }

          if (objSetCounter < objSetSize){
            document.write(","+ "</br>");
          } 
         })

         if (objSet.size > 1 ){ 
          document.write("</br>&nbsp;&nbsp;]");
         }
        
        if (predMapCounter < predMapSize){
          document.write(", </br>");
        } else{
          document.write("</br>");
        }  
      })                
      
      if (turtleMapCounter < turtleMapSize){
        document.write("&nbsp;&nbsp;&nbsp;" +"},"+ "</br>");
      } else{
        document.write("&nbsp;&nbsp;&nbsp;" +"}" + "</br>");
      }

  });  
    document.write("&nbsp;&nbsp;&nbsp;" +"]" + "</br>" + "&nbsp;}"+ "<br/>" + "]");
 return turtle_text;
}


function JSON_to_MAP(turtleMap, href, rel, val) {

  if (hyperCatRels[rel] != null) {
    sub = formatIDURI(href);
    pred = formatURI(hyperCatRels[rel].rdfRel);
    // check if val needs to be tranlated into RDF
    if (hyperCatVals[val] != null) {
      val = hyperCatVals[val].rdfVal;
    }
  
    obj = hyperCatRels[rel].rdfValFunc(val);
    // predicate not in turtleMap
    if(turtleMap.get(sub) == null){
        const objSet = new Set();
        objSet.add(obj);
        const predMap = new Map();
        predMap.set(pred,objSet);
        turtleMap.set(sub,predMap);
    }
    // predicate already in turleMap
    else {
      // predicate already exists
      if(turtleMap.get(sub).get(pred) != null){
        turtleMap.get(sub).get(pred).add(obj)
      }
      else { 
        const objSet = new Set();
        objSet.add(obj);
        turtleMap.get(sub).set(pred,objSet);
      }
    }
  }
}

// Translate a JSON triple into an RDF triple
function JSON_to_RDF(href, rel, val) {

  // RDF Subject (catalogue URI or item href)
  var triple_text = formatURI(href);

  // JSON to RDF translation defined for the given rel
  if (hyperCatRels[rel] != null) {
    //RDF Predicate
    triple_text +=  formatURI(hyperCatRels[rel].rdfRel);

    // check if val needs to be tranlated into RDF
    if (hyperCatVals[val] != null) {
      val = hyperCatVals[val].rdfVal
    }
    
    // RDF Object
    triple_text += hyperCatRels[rel].rdfValFunc(val);
    return triple_text + ".<br/>";
    
  } else {
    // JSON to RDF translation is not defined for the given rel
    if (document.getElementById("includeErrors").checked){
      return "<font color=\"red\">Error! Could not translate: \"" + href + "\" \"" + rel + "\" \"" + val + "\"</font> .<br/>";
    } else {
      return "";
    }
  }
}

//return a given uri
function formatURI(uri) {
  return  uri;
}
//return a given uri
function formatURITYPE(uri) {
  return  '"'+ uri + '"';
}
//return a given uri with @id
function formatIDURI(uri) {
  return '"@id": "' + uri + '"';
}
function formatIDURI2(uri) {
  return "{" + "</br>" +  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +'"@id":' + uri  + "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;"+ '}';
}
// return a function that will transform a given literal into JSON-LD 
// format for a specific literal
function formatLiteral(type) {
  return function(literal) { return type + '"' + literal + '"'; }
}
//return of formats with @value
function formatLiteralValue(type) {
  return function(literal) { return type + '"@value": "' + literal.replace(/"/g, "\\\"") + '"' + "<br/>" + "&nbsp;&nbsp;&nbsp;&nbsp;" + "}"; }
}
//return of formats with @id
function formatLiteralID(type) {
  return function(literal) { return type + "{" + "</br>" +  "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +'"@id": "' + literal + '"' + "</br>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+ '}';}
}  
