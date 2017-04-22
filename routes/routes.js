// routes/routes.js

// expose the routes to our app with module.exports
module.exports = function(app) {
    
    var mongodb = require('mongodb');

    // MongoDB
    var MongoClient = require('mongodb').MongoClient;
    //var assert = require('assert');
    //var ObjectId = require('mongodb').ObjectID;
    var db;
    
    // jwt token authentication credentials
    var jwt = require('jsonwebtoken');
    var secret = require('../secret.json');
    //var Q = require('q');
    var parmuser = "";
    var parmpassword = "";
    var authJ = "";
    
    // Web Resume  
    var personalJ = "";
    //var emailJ = "";
    var sitelinksJ = [];
    var sitelinkJ = "";
    var sitelinkID = "";
    var servicesJ = [];
    var projectsJ = [];
    var projectJ = "";
    var projectID = "";
    //var projecttype = "";
    var skillsJ = [];
    var skillJ = "";
    var skillID = "";
    var skilltype = "";
  
   
    // Initialize connection once
    MongoClient.connect("mongodb://localhost:27017/test", function(err, database) {
        if(err) return console.error(err);
        db = database;
  
        // the Mongo driver recommends starting the server here because most apps 
        //*should* fail to start if they have no DB.  If yours is the exception, 
        //move the server startup elsewhere. 
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
                    "id" : doc.id,
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
    
    
    // Get resume sitelink data by sitelink ID
    app.get("/api/resume/sitelink", function(req, res, next) {
        sitelinkID = req.param('sitelinkID');
        db.collection("wr_sitelinks").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
            }
            if(doc) {
                // store the sitelink detail in a json string
                if (sitelinkID == doc.id) {
                    sitelinkJ = { 
                        "sitename" : doc.sitename,
                        "sitelink" : doc.sitelink
                    };
                }
            }
            else {
                res.json(sitelinkJ);
                sitelinkJ = [];
                res.end();
                }
            });
        });
    });
    
    
    // Insert a new resume sitelink 
    app.get("/api/resume/newSitelink", function(req, res, next) {
        //Get the next sitelink id value 
        db.collection("wr_sitelinks").count({}, 
        function(err, count) {
            if(err) console.log("count err: ", err);
            count = count + 1;
            //create the new sitelink 
            var sitename = req.param('sitename');
            var sitelink = req.param('sitelink');
            db.collection("wr_sitelinks").insert(
                {
                "id":count,
                "sitename":sitename, 
                "sitelink":sitelink
                }, 
            function(err, result) {
                if(err) return next(err);
                res.json(result);
                res.end();
            });
        });
    });
    
    // Update a resume sitelink 
    app.get("/api/resume/updSitelink", function(req, res, next) {
        var id = req.param('id');
        var sitename = req.param('sitename');
        var sitelink = req.param('sitelink');
        var query = {"id":Number(id)};
        var doc = {
            "id":Number(id),
            "sitename":sitename, 
            "sitelink":sitelink
            };
        db.collection("wr_sitelinks").update(query, doc, function(err, result) {
            if(err) {
                console.log("Error:",err);
                return next(err);
            };
            res.json(result);
            res.end();
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
    
    // Get resume skills (all)
    app.get("/api/resume/allskills", function(req, res, next) {
        db.collection("wr_skill").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
            }
            if(doc) {
                // store the skill detail in a json array
                skillsJ.push({ 
                    "id" : doc.id,
                    "skillname" : doc.skillname,
                    "skilltype" : doc.skilltype
                });
            }
            else {
                res.json(skillsJ);
                skillsJ = [];
                res.end();
                }
            });
        });
    });
    
    // Get resume skill data by skill type
    app.get("/api/resume/skills", function(req, res, next) {
        skilltype = req.param('skilltype');
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
  
    // Get resume skill data by skill ID
    app.get("/api/resume/skill", function(req, res, next) {
        skillID = req.param('skillID');
        db.collection("wr_skill").find({}, function(err, docs) {
            if(err) return next(err);
        docs.each(function(err, doc) {
            if(err) {
                res.json(err); 
                console.log("Error:",err);
            }
            if(doc) {
                // store the skill detail in a json string
                if (skillID == doc.id) {
                    skillJ = { 
                        "skillname" : doc.skillname,
                        "skilltype" : doc.skilltype
                    };
                }
            }
            else {
                console.log("skillJ: ", skillJ);
                res.json(skillJ);
                skillJ = [];
                res.end();
                }
            });
        });
    });
    
 
    
    // Update a resume skill 
    app.get("/api/resume/updSkill", function(req, res, next) {
        var id = req.param('id');
        var skillname = req.param('skillname');
        var skilltype = req.param('skilltype');
        var query = {"id":Number(id)};
        var doc = {
            "id":Number(id),
            "skillname":skillname, 
            "skilltype":skilltype
            };
        db.collection("wr_skill").update(query, doc, function(err, result) {
            if(err) {
                console.log("Error:",err);
                return next(err);
            };
            res.json(result);
            res.end();
        });
    });
    
    // Get a count of resume skills  
    app.get("/api/resume/skillCount", function(req, res, next) {
        db.collection("wr_skill").count({}, function(err, result) {
            if(err) return next(err);
            res.json(result);
            res.end();
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
                    projectsJ.push({ 
                        "id" : doc.id,
                        "name" : doc.name,
                        "year" : doc.year,
                        "note" : doc.note,
                        "type" : doc.type
                    });
                }
                else {
                    res.json(projectsJ);
                    projectsJ = [];
                    res.end();
                }
            });
        });
    });
    
    // Insert a new resume skill 
    app.get("/api/resume/newSkill", function(req, res, next) {
        //Get the next skill id value 
        db.collection("wr_skill").count({}, 
        function(err, count) {
            if(err) console.log("count err: ", err);
            count = count + 1;
            //create the new skill 
            var skillname = req.param('skillname');
            var skilltype = req.param('skilltype');
            db.collection("wr_skill").insert(
                {
                "id":count,
                "skillname":skillname, 
                "skilltype":skilltype
                }, 
            function(err, result) {
                if(err) return next(err);
                res.json(result);
                res.end();
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
    
    // Authenticate user credentials and return JWT
    app.get("/api/resume/authenticate", function(req, res, next) {
        parmuser = req.param('user');
        parmpassword = req.param('password');
        authJ = "";
        
        db.collection("wr_user")
        .findOne({ user: parmuser, password : parmpassword}, 
        function(err, doc) {
            if(err) return next(err);
            if(doc) {
                // Authentication Successful 
                // Send the user name and token
                authJ = { 
                    "name" : doc.name,
                    "token" : jwt.sign({ sub: doc.id },  
                    secret.secret)
                };
                res.json(authJ);
                authJ = "";
                res.end();
            }
            else {
                res.json(authJ);
                authJ = "";
                res.end();
            }
        });
    });
 
 
    app.use(function(err, req, res){
        // handle error here.  For example, logging and returning a friendly error page
        console.log("api error:", err);
    });

};
