var name;
var thirdpartyid;
var experienceId;
var mboxName;
var content;
var activityNm;
var experienceNm;
var skuList;
var contents;

// member.json 파일 불러오기
fetch('../../resource/json/member.json') // JSON 파일의 상대경로 지정
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }

        return response.json(); // JSON 파일을 JavaScript 객체로 변환
    })
    .then(member => {
        // JSON 데이터 사용
        var size = member.list.length;

        for(var i=0; i<size; i++){

            name = member.list[i].id;
            thirdpartyid = member.list[i].thirdpartyid;
            tdpid = thirdpartyid.slice(0,10) + "...";



            document.getElementById("list").insertAdjacentElement("beforeend",
                document.createElement("tr")).innerHTML = "<td id='name_" + i + "' class='name'>" + name + "</td><td id='thirdpartyid_" + i + "' class='thirdpartyid'>" + tdpid + "</td>";

            var data = {
                "environmentId": "4334",
                "id": {
                    "thirdPartyId": thirdpartyid
                },
                "property": {
                    "token": "b27446df-28c2-4fd0-c72f-6607f8d14050"
                },
                "context": {
                    "channel": "mobile",
                    "mobilePlatform": { "deviceType": "phone",
                        "platformType": "android" }
                },
                "execute": {
                    "mboxes": [
                        { "name": "Home_Feed_Rec_DS_01",
                            "index" : "1"
                        }
                    ]
                }
            };

            //서드파티id delivery로 POST 메뉴추천확인
            $.ajax({
                url: 'https://starbuckskr.tt.omtrdc.net/rest/v1/delivery?sessionId=gdaDtiaURVSuRZjqJMrDoqdOVQutKYYGZWmHrumcLXkxRdkCbx&client=starbuckskr',
                contentType: "application/json",
                method: 'post',
                data: JSON.stringify(data),
                dataType: 'JSON',
                async: false,
                success: function (data, status, xhr) {

                    experienceId = data.id.thirdPartyId;
                    mboxName = data.execute.mboxes[0].name;
                    content = data.execute.mboxes[0].options[0].content;
                    contents = content.split('","');

                    for(var j=0; j<contents.length; j++){

                        if(contents[j].indexOf("activityNm")>=0){
                            activityNm = contents[j].split('":"')[1];
                        }

                        if(contents[j].indexOf("experienceNm")>=0){
                            experienceNm = contents[j].split('": "')[1];
                        }

                        if(contents[j].indexOf("skuList")>=0){
                            skuList = contents[j].split('":"')[1].replace('"}','');

                            skuList = skuList.split(',').join(' | ');
                            
                        }

                    }

                    document.getElementById("thirdpartyid_" + i).insertAdjacentElement("afterend",document.createElement("td")).setAttribute('id','experienceNm_'+i);
                    document.getElementById("experienceNm_"+i).innerHTML = experienceNm;

                    document.getElementById("experienceNm_" + i).insertAdjacentElement("afterend",document.createElement("td")).setAttribute('id','skuList'+i);
                    document.getElementById("skuList"+i).innerHTML = skuList;

                },
                error: function (data, status, err) {
                    console.log("err")
                    console.log(err);
                },
                complete : function (data){
                    console.log("complate");
                }

            });

        }

    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });



//
// //서드파티id로 고객속성조회
// $.ajax({
//     url: 'https://starbuckskr.tt.omtrdc.net/rest/v1/profiles/thirdPartyId/1cdc1c7b3fc443af1534a4e781901c861becefe8bf3c1fe37a4942228ad8e192?client=starbuckskr',
//     method: 'get',
//     data: '',
//     dataType: 'JSON',
//     success: function (data, status, xhr) {
//         console.log("//서드파티id로 고객속성조회")
//         console.log("data : : " + JSON.stringify(data));
//     },
//     error: function (data, status, err) {
//         console.log(err);
//     },
//     complete : function (data){
//         console.log("complate");
//         console.log(data);
//         console.log("==============================================================================================")
//     }
//
// });




