module.exports = function(app, Issue)
{
    // GET ALL IssueS
    app.get('/issues', function(req,res){
      Issue.find(function(err, issues){
        if(err) return res.status(500).send({error: 'database failure'});
        res.json(issues);
      });
    });

    // GET Issue BY AUTHOR
    app.get('/issues/company/:company', function(req, res){
      Issue.find({company: req.params.company}, function(err, issues){ //author일치 Issue 모두 find
        if(err) return res.status(500).json({error: err});
        if(issues.length === 0) return res.status(404).json({error: 'Issue not found'});
        res.json(issues);
      })
    });

    app.get('/issues/create', function(req, res){
      var book = new Issue();
      book.company = 'sex';
      book.save(function(err){
          if(err){
              console.error(err);
              res.json({result: 0}); //실패하면 0반환
              return;
          }
          res.json({result: 1}); // 성공하면 1반환
      });
    });

}
