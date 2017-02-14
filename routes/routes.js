// routes/routes.js

// expose the routes to our app with module.exports
module.exports = function(app) {
    
    var mongodb = require('mongodb');

    // MongoDB
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var db;
    var personalJ = "";
    var emailJ = "";
    var sitelinksJ = [];
    var servicesJ = [];
    var skillsJ = [];
    var projectsJ = [];
    var projectJ = "";
    var projectID = "";
    var skilltype = "";
    var projecttype = "";

    // Initialize connection once
    MongoClient.connect("mongodb://localhost:27017/test", function(err, database) {
        if(err) return console.error(err);
        db = database;
  
        // the Mongo driver recommends starting the server here because most apps *should* fail to start if they have no DB.  If yours is the exception, move the server startup elsewhere. 
    });

    // Reuse database object in request handlers
    
    // Get resume personal data 
    app.get("/api/resume/personal", function(req, res, next) {
        db.collection("wr_personal").find({}, function(err, docs) {
        if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
                }
            if(doc) {
                personalJ = { 
                    "name" : doc.name,
                    "title" : doc.title,
                    "phone" : doc.phone
                    };
                res.json(personalJ);
                }
            else {
                res.json(personalJ);
                personalJ = "";
                res.end();
                }
            });
        });
    });
    
     // Get resume email data 
    app.get("/api/resume/email", function(req, res, next) {
        db.collection("wr_email").find({}, function(err, docs) {
        if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
                }
            if(doc) {
                res.json(doc);
                //console.log(doc);
                }
            else {
                res.end();
                }
            });
        });
    });
    
    
    // Get resume site link data 
    app.get("/api/resume/sitelinks", function(req, res, next) {
        db.collection("wr_sitelinks").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
                }
            if(doc) {
                // store the link detail in a json array
                sitelinksJ.push({ 
                    "sitename" : doc.sitename,
                    "sitelink"  : doc.sitelink
                });
                }
            else {
                res.json(sitelinksJ);
                sitelinksJ = [];
                res.end();
                }
            });
         });
    });
    
    
    // Get resume services data 
    app.get("/api/resume/services", function(req, res, next) {
        db.collection("wr_services").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
                }
            if(doc) {
                // store the service detail in a json array
                servicesJ.push({ 
                    "service" : doc.service
                });
                }
            else {
                res.json(servicesJ);
                servicesJ = [];
                res.end();
                }
            });
         });
    });
    
    // Get resume skill data 
    app.get("/api/resume/skills", function(req, res, next) {
        skilltype = req.param('skilltype');
        //console.log("skilltype: ", skilltype);
        db.collection("wr_skill").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
            }
            if(doc) {
                // store the skill detail in a json array
                if (skilltype === doc.skilltype) {
                    skillsJ.push({ 
                        "skillname" : doc.skillname
                    });
                }
            }
            else {
                res.json(skillsJ);
                skillsJ = [];
                res.end();
                }
            });
        });
    });
  
    // Get all resume projects data 
    app.get("/api/resume/projects", function(req, res, next) {
        db.collection("wr_project").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
            }
            if(doc) {
                // store the project detail in a json array
                //if (projecttype === doc.type) {
                    projectsJ.push({ 
                        "id" : doc.id,
                        "name" : doc.name,
                        "year" : doc.year,
                        "note" : doc.note,
                        "type" : doc.type
                    });
                //}
            }
            else {
                res.json(projectsJ);
                projectsJ = [];
                res.end();
                }
            });
        });
    });
 
   // Get a count of resume projects  
    app.get("/api/resume/projectCount", function(req, res, next) {
        db.collection("wr_project").count({}, function(err, result) {
            if(err) return next(err);
            res.json(result);
            res.end();
        });
    });
    
    // Get resume project data by project ID
    app.get("/api/resume/project", function(req, res, next) {
        projectID = req.param('projectID');
        db.collection("wr_project").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
            }
            if(doc) {
                // store the project detail in a json string
                if (Number(projectID) === Number(doc.id)) {
                    projectJ = { 
                        "name" : doc.name,
                        "year" : doc.year,
                        "note" : doc.note,
                        "type" : doc.type
                    };
                }
            }
            else {
                res.json(projectJ);
                projectJ = [];
                res.end();
                }
            });
        });
    });
    
    // Insert a new resume project 
    app.get("/api/resume/newProject", function(req, res, next) {
        //Get the next project id value 
        db.collection("wr_project").count({}, 
        function(err, count) {
            if(err) console.log("count err: ", err);
            count = count + 1;
            //create the new project 
            var name = req.param('name');
            var year = req.param('year');
            var note = req.param('note');
            var type = req.param('type');
            db.collection("wr_project").insert(
                {
                "id":count,
                "name":name, 
                "year":year, 
                "note":note, 
                "type":type
                }, 
            function(err, result) {
                if(err) return next(err);
                res.json(result);
                res.end();
            });
        });
    });
    
    // Update a resume project 
    app.get("/api/resume/updProject", function(req, res, next) {
        var id =  req.param('id');
        var name = req.param('name');
        var year = req.param('year');
        var note = req.param('note');
        var type = req.param('type');
        var query = {"id":Number(id)};
        var doc = {
            "id":Number(id),
            "name":name, 
            "year":year, 
            "note":note, 
            "type":type
            };
        db.collection("wr_project").update(query, doc, function(err, result) {
            if(err) {
                console.log("Error:",err);
                return next(err);
            };
            res.json(result);
            res.end();
        });
    });
    
    app.use(function(err, req, res){
        // handle error here.  For example, logging and returning a friendly error page
        console.log("api error:", err);
    });

};
