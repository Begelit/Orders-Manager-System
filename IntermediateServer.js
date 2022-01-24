function doGet(e) {
  if(typeof e == 'undefined')
  {
    Logger.log('undefined');
  }
  else if(!e.parameter.pageApp)
  {
    //-------------Авторизация----------------
    var emailUser = Session.getActiveUser().getEmail();
    var regDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

    var formData = {
    'emailUser': emailUser,
    'regDate' : regDate,
    'processingStatus': 'processingUser'
    };
    
    var options = {
    'method' : 'post',
    'payload' : formData
    };

    var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";
    

    res = UrlFetchApp.fetch(urlServer, options);
    Logger.log(res)
    contentText = res.getContentText();
    parseContentText = JSON.parse(contentText);
    Logger.log(parseContentText);
    //-------------Возврат страницы в зависимости от роли----------------
    if(parseContentText.userStatus == "customer")
    {
        htmlOutput = HtmlService.createTemplateFromFile('UserApplicationForm');
        htmlOutput.url = getURL();
        htmlOutput.orders = JSON.parse(contentText);
        return htmlOutput.evaluate();
    }
    else if ((parseContentText.myUserStatus == "manager")||(parseContentText.myUserStatus == "gen-manager"))
    {
      Logger.log(contentText);
      Logger.log(parseContentText);

        htmlOutput = HtmlService.createTemplateFromFile('ManagerApplicationForm');
        htmlOutput.url = getURL();
        htmlOutput.users = parseContentText.users;
        htmlOutput.orders = parseContentText.orders;
        htmlOutput.history = parseContentText.history;
        htmlOutput.historyExChange = parseContentText.historyExChange;

        return htmlOutput.evaluate();
    }
    else if(parseContentText.myUserStatus == "executer")
    {
      
      htmlOutput = HtmlService.createTemplateFromFile('ExecuterApplicationForm');
      htmlOutput.orders = parseContentText;
      htmlOutput.url = getURL();
      return htmlOutput.evaluate();
    };
  }
  //-------------Возвращает страницу формы заполнения заявки----------------
  else if(e.parameter['pageApp'] == 'createnewapp')
  {
    //Logger.log(e.parameter);
    htmlOutput = HtmlService.createTemplateFromFile('CreateApplicationForm');
    htmlOutput.url = getURL();
    return htmlOutput.evaluate();
  }
  else if(e.parameter['pageApp'] == 'returnUserPage')
  {

    var emailUser = Session.getActiveUser().getEmail();
    var applicationName = e.parameter.appName;
    var shortdescription = e.parameter.shortDescript;
    var createDateApp = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
    var dateOfEnding = e.parameter.date;

    var appData = {
      'emailUser' : emailUser,
      'applicationName' : applicationName,
      'shortDescription' : shortdescription,
      'creatingDateApp' : createDateApp,
      'dateofEnding' : dateOfEnding,
      'processingStatus' : 'sendAppData'
    }

    var options = {
    'method' : 'post',
    'payload' : appData
    };

    var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";

    res = UrlFetchApp.fetch(urlServer, options);
    responseCode = res.getResponseCode(); 
    contentText = res.getContentText();

    htmlOutput = HtmlService.createTemplateFromFile('UserApplicationForm');
    htmlOutput.url = getURL();
    htmlOutput.orders = JSON.parse(contentText);
    return htmlOutput.evaluate();
  }
 else if (e.parameter['pageApp'] == 'changeAccess')
  {
    var changeAccessData = new Object();
    var num = 0;
    for (i = 2; i <= e.parameter.sumusers; i++)
    {
      if(e.parameter[i])
      {
        num++;
        if (e.parameter[i].slice(e.parameter[i].length-6) == "Manage")
          {
            changeAccessData[num] = 
            {
              'email' : e.parameter[i].slice(0,e.parameter[i].length-6),
              'access' : 'manager'
            };
          }
        else if (e.parameter[i].slice(e.parameter[i].length-6) == "Custom")
          {
            changeAccessData[num] = 
            {
              'email' : e.parameter[i].slice(0,e.parameter[i].length-6),
              'access' : 'customer'
            };
          }
          else if (e.parameter[i].slice(e.parameter[i].length-6) == "Execut")
          {
            changeAccessData[num] = 
            {
              'email' : e.parameter[i].slice(0,e.parameter[i].length-6),
              'access' : 'executer'
            };
          };
      };
    };
  changeAccessData['sumUsers'] = num;
  changeAccessData['date'] = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  changeAccessData['manager'] = Session.getActiveUser().getEmail();
  requestsForEachUser(changeAccessData);

    var emailUser = Session.getActiveUser().getEmail();
    var regDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

    var formData = {
    'emailUser': emailUser,
    'regDate' : regDate,
    'processingStatus': 'processingUser'
    };
    
    var options = {
    'method' : 'post',
    'payload' : formData
    };

    var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";
    

    res = UrlFetchApp.fetch(urlServer, options);
    contentText = res.getContentText();
    parseContentText = JSON.parse(contentText);

    if(parseContentText.userStatus == "customer")
    {
        htmlOutput = HtmlService.createTemplateFromFile('UserApplicationForm');
        htmlOutput.url = getURL();
        htmlOutput.orders = JSON.parse(contentText);
        return htmlOutput.evaluate();
    }
    else if ((parseContentText.users.myUserStatus == "manager")||(parseContentText.users.myUserStatus == "gen-manager"))
    {
        htmlOutput = HtmlService.createTemplateFromFile('ManagerApplicationForm');
        htmlOutput.url = getURL();
        htmlOutput.users = parseContentText.users;
        htmlOutput.orders = parseContentText.orders;
        htmlOutput.history = parseContentText.history;
        htmlOutput.historyExChange = parseContentText.historyExChange;

        return htmlOutput.evaluate();
    }
  }
  else if (e.parameter['pageApp'] == "changeOrderStatus")
  {
    if(Object.keys(e.parameter)[0] != "pageApp")
    {
      var numOrder = Object.keys(e.parameter)[0];
      if( e.parameter[numOrder] == "confirm")
        var statusOrder = "confirmed";
      else var statusOrder = "completed";
      //Logger.log(statusOrder);
    } else
    {
      var numOrder = Object.keys(e.parameter)[1];
      if( e.parameter[numOrder] == "confirm")
        var statusOrder = "confirmed";
      else var statusOrder = "completed";
    };

    var dataChangeStatusOrder =
    {
      'numOrder': numOrder,
      'statusOrder': statusOrder,
      'date': Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      'myGmail': Session.getActiveUser().getEmail(),
      'processingStatus': 'changeStatusOrder'
    };
    
    var options = {
    'method' : 'post',
    'payload' : dataChangeStatusOrder
    };

    var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";
    res = UrlFetchApp.fetch(urlServer, options);

    htmlOutput = HtmlService.createTemplateFromFile('ExecuterApplicationForm');
    htmlOutput.orders = JSON.parse(res.getContentText());
    htmlOutput.url = getURL();
    return htmlOutput.evaluate();
  }
  else if (e.parameter['pageApp'] == "changeExec")
  {
    var objExec = e.parameter;
    delete objExec["pageApp"];
    delete objExec["ChangeExecuter"];
    //objExec["sumOrders"] = Object.keys(objExec).length
    objExec["processingStatus"] = "changeExecuter";
    objExec["emailUser"] = Session.getActiveUser().getEmail();
    objExec["date"] = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

    var options = {
    'method' : 'post',
    'payload' : objExec
    };
    //Logger.log(options);


    var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";
    res = UrlFetchApp.fetch(urlServer, options);
    var emailUser = Session.getActiveUser().getEmail();
    var regDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");

    var formData = {
    'emailUser': emailUser,
    'regDate' : regDate,
    'processingStatus': 'processingUser'
    };
    
    var options = {
    'method' : 'post',
    'payload' : formData
    };

    var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";
    

    res = UrlFetchApp.fetch(urlServer, options);
    contentText = res.getContentText();
    parseContentText = JSON.parse(contentText);
    htmlOutput = HtmlService.createTemplateFromFile('ManagerApplicationForm');
    htmlOutput.url = getURL();
    htmlOutput.users = parseContentText.users;
    htmlOutput.orders = parseContentText.orders;
    htmlOutput.history = parseContentText.history;
    htmlOutput.historyExChange = parseContentText.historyExChange;
    return htmlOutput.evaluate();
  };

};


function requestsForEachUser(userobj)
{
  for(i = 1; i <= userobj.sumUsers; i++)
    {
      var accessUserData = 
      {
        'emailUser' : userobj[i].email,
        'access' : userobj[i].access,
        'manager' : userobj.manager,
        'date' : userobj.date,
        'processingStatus': 'changeAccess'
      };

      var options =
      {
        'method' : 'post',
        'payload' : accessUserData,
      };

      var urlServer = "https://script.google.com/macros/s/AKfycbzywjYl-gMDtYYQ-Bvm6xRMvU63GAShHEnz2TjxLIGLSl995QTXtf7F6ShglX0l5hIS/exec";

      UrlFetchApp.fetch(urlServer, options);

  };

};

function getURL()
{
  var url = ScriptApp.getService().getUrl();
  return url;
};