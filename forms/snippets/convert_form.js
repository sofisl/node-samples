// Copyright 2022 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

const path = require('path');
const google = require('@googleapis/forms');
const {
  authenticate
} = require('@google-cloud/local-auth');

async function runSample(query) {
  const authClient = await authenticate({
    keyfilePath: path.join(__dirname, 'credentials.json'),
    scopes: 'https://www.googleapis.com/auth/drive'
  });

  const forms = google.forms({
    version: 'v1beta',
    auth: authClient
  });

  const newForm = {
    "info": {
      "title": "Creating a new form for batchUpdate in Node"
    }
  }

  const res1 = await forms.forms.create({
    requestBody: newForm
  });
  console.log('New formId was: ' + res1.data.formId);


  // Request body to convert form to a quiz
  const update = {
    "requests": [{
      "updateSettings": {
        "settings": {
          "quizSettings": {
            "isQuiz": true
          }
        },
        "updateMask": "quizSettings.isQuiz"
      }
    }]
  }


  const res = await forms.forms.batchUpdate({
    formId: res1.data.formId,
    requestBody: update
  });


  console.log(res.data);
  return res.data;
}

if (module === require.main) {
  runSample().catch(console.error);
}
module.exports = runSample;