// Container Bound: Google Spreadsheet
// Check Meet Logs and prints to Spreadsheet (last 7 days, if useremail starts with 'st.')

var list =[]

function checkMeetLogs(index, searchDate) {
var userKey = 'all';
  var applicationName = 'meet';
  var now = new Date();
  var twoWeeksAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  var startTime = twoWeeksAgo.toISOString();
  var endTime = now.toISOString();
  var pageToken;
  var pagina = 0;

try{ 
 list.push(['Codigo Sucio','TimeStamp BsAs','Usuario']);

  do { 
    var optionalArgs = {
        event_name: "call_ended",
        pageToken : pageToken,
        startTime: startTime,
        endTime: endTime
      };
    var parameters = [
                      'meeting_code'
                    ];

  console.log("PageToken inicio:", pageToken);
  var response = AdminReports.Activities.list('all', 'meet', optionalArgs)
  var myItems = response.items;

      // console.log (myItems);
      for (i = 0; i < myItems.length; i++) {
        console.log(i);
        var row = [] // Array para la fila
        var datos = myItems[i];
        var theEvent = datos.events; // Entra en el Object Property EVENTS
        var parametros = theEvent[0].parameters // Entra en el primer Array dentro de EVENTS y Propiedad PARAMETERS dentro de ese array.
        var correo = datos.actor.email;

        if(parametros);{
              var parameterValues = getParameterValues2(parametros);
              var codigoMeet = parameterValues['meeting_code'];                      
        //    console.log(correo);
            if(correo && !correo.includes("st.")){ // Similar a indexOf . Si correo NO contiene "st."
                var fechaArg = cambiarHorario(datos.id.time) // Modifica la hora a Argentina
                row.push(codigoMeet, fechaArg, correo) // Empujamos fila
        //    console.log(row);
              }
        }
        if (row && row.length>0){
      //     console.log("Pushing row:" + row)    
            list.push(row); // Empujamos todo el array filas
      }
  }

  pageToken = response.nextPageToken;
  // console.log("PageToken final:", pageToken);
  pagina = pagina+1;

    } while (pageToken && pagina < 3);
      if(list.length > 0) {
        //SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Meet Diarios Test").getRange(2,5,list.length ,list[0].length).setValues(list);
        var sheetData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Meet Logs Diarios")
        sheetData.getRange(2,6,list.length,list[1].length).setValues(list);
        }
    
    //Escribe el ultimo RUN del script
  var lastRun = "Last Run: "+Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy HH:mm")+" (ESP)"; 
  sheetData.getRange(1, 6).setValue(lastRun); 
} catch (e){
  console.log("Error logged: "+e)
  }    
} 

function cambiarHorario(timeStamp){
  //var timeStamp = 'Mon Feb 21 19:44:56 GMT-05:00 2022'
  var stampTime = new Date(timeStamp);
  var timeFormateado = Utilities.formatDate(stampTime, 'GMT-3', 'dd/MM/yyyy HH:mm:ss');
  return timeFormateado
}

function getParameterValues2(parameters) {
try{ 
    return parameters.reduce(function(result, parameter) {
    var name = parameter.name;
    var value;
    if (parameter.intValue !== undefined) {
      value = parameter.intValue;
    } else if (parameter.value !== undefined) {
      value = parameter.value;  
    } else if (parameter.stringValue !== undefined) {
      value = parameter.stringValue;
    } else if (parameter.datetimeValue !== undefined) {
      value = new Date(parameter.datetimeValue);
    } else if (parameter.boolValue !== undefined) {
      value = parameter.boolValue;
    }
    result[name] = value;
    //console.log("Result getParameterValues ="+result); // Returns [object Object]
    return result;
  }, {});
} catch (e){
  console.log("Error logged: "+e)
          }
}