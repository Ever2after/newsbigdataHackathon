var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var issueSchema = new Schema({
    company : String,
    keywords:String,
    news:[{
      news_id : String,
      title : String,
      hilight : String,
      published_at : String,
      enveloped_at : String,
      dateline : String,
      provider : String,
      category : [{type : String}],
      category_incident : [{type:String}],
      byline : String,
      provider_news_id : String,
      impact_factor : Number,
      summarized_category : [{type : String}]
    }],
    startDate : String,
    endDate : String,
});

module.exports = mongoose.model('stocklife', issueSchema);
