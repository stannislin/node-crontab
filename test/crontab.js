var expect = require('expect.js'),
    crontab = require('../lib/crontab.js');

describe('Crontab', function(){
    it('creates normal task', function(done){
        //Creates a task
        var jobId = crontab.scheduleJob("* * * * *", function(){
            console.log("Hello world");
        });
        expect(typeof(jobId)).to.be(typeof(new Date().getTime()));
        done();
    });

    it('creates long-term task', function(done){
        //This test schedules a function for yesterday of this month, which should make the difference be greater than MAX_SET_TIMEOUT, meaning this should be scheduled in the delayed queue
        var date = new Date();
        var yesterdayOfNextYear = "* * " + (date.getDate()-1) + " " + (date.getMonth()+1) + " *";
        var jobId = crontab.scheduleJob(yesterdayOfNextYear, function(){
            console.log("Hello world");
        });
        expect(typeof(jobId)).to.be(typeof(new Date().getTime()));
        done();
    });

    it('executes task', function(done){
        //This job relies on cron-parser's support for second-based parsing, schedules a task that should fire on the next second
        var jobId = crontab.scheduleJob("* * * * * *", function(){
            done();
        }, null, null, false);
        setTimeout(function(){
            done("Didn't execute callback");
        }, 2000);
    });

    it('cancels task', function(done){
        //Schedules a task, then cancels it and expects canceled to be true
        var jobId = crontab.scheduleJob("* * * * * *", function(){
            console.log("Hello world.");
        });
        var canceled = crontab.cancelJob(jobId);
        expect(canceled).to.be(true);
        done();
    });

    it('fails to cancel invalid task id', function(done){
        //Tries to cancel a task that shouldn't exist.
        var result = crontab.cancelJob((new Date()).getTime());
        expect(result).to.be(false);
        done();
    });
});