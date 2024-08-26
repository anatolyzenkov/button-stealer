1 const MAXIMUM = 'maximum';
2 const CNTFL_MGMT_API_KEY = 'contentManagementApiKey';
3 const CNTFL_DLVR_API_KEY = 'contentDeliveryApiKey';
4 const CNTFL_SPACE_ID = 'spaceId';
5 const CNTFL_TYPE_ID = 'contentTypeId';
6 const CONTENTFUL = 'contentful';
7 const IGNORE = 'ignore';
8 const BUTTONS = 'buttons';
9 const UPLOAD = 'upload';
10 const OFFSCREEN_DOCUMENT_PATH = '/offscreen/offscreen.html';
11 let isDark = false;
12 
13 chrome.runtime.onInstalled.addListener(async ({ reason }) => {
14     switch (reason) {
15         case 'install':
16             chrome.storage.local.set({
17                 buttons: [],
18                 upload: [],
19                 ignore: [],
20                 maximum: 200,
21                 contentful: {
22                     contentManagementApiKey: '',
23                     contentDeliveryApiKey: '',
24                     spaceId: '',
25                     contentTypeId: ''
26                 }
27             });
28             break;
29         case 'update':
30             const { buttons, upload, contentful } = await chrome.storage.local.get([BUTTONS, UPLOAD, CONTENTFUL]);
31             if (buttons.length === 0) break;
32             let counter = buttons.length - 1;
33             buttons.map(button => { button.id = counter--; button.hidden = false;} );
34             chrome.storage.local.set({ buttons: buttons });
35             if (!upload) chrome.storage.local.set({ 'upload': [] });
36             if (!contentful.contentDeliveryApiKey) {
37                 contentful.contentDeliveryApiKey = '';
38                 chrome.storage.local.set({ 'contentful': contentful });
39             }
40             break;
41         default:
42             break;
43     }
44 });
45 
46 chrome.storage.onChanged.addListener(async (obj) => {
47     switch (true) {
48         case obj.hasOwnProperty(MAXIMUM):
49             const { buttons } = await chrome.storage.local.get(BUTTONS);
50             while (buttons.length >= obj.maximum.newValue) buttons.pop();
51             chrome.storage.local.set({ 'buttons': buttons });
52             break;
53         case obj.hasOwnProperty(UPLOAD):
54             uploadOffscreen();
55             break;
56         case obj.hasOwnProperty(CONTENTFUL):
57             uploadOffscreen();
58             break;
59         default:
60             break;
61     }
62 });
63 
64 const uploadOffscreen = async () => {
65     const { upload, contentful } = await chrome.storage.local.get([UPLOAD, CONTENTFUL]);
66     if (!(contentful[CNTFL_MGMT_API_KEY] && contentful[CNTFL_DLVR_API_KEY] && contentful[CNTFL_SPACE_ID] && contentful[CNTFL_TYPE_ID])) {
67         if (upload.length > 0) chrome.storage.local.set({ 'upload': [] });
68         return;
69     }
70     if (upload.length === 0) {
71         chrome.runtime.sendMessage({
72             type: 'full-sync',
73             target: 'offscreen',
74             contentful: contentful
75         });
76         return;
77     }
78     if (!(await hasDocument())) {
79         await chrome.offscreen.createDocument({
80             url: OFFSCREEN_DOCUMENT_PATH,
81             reasons: [chrome.offscreen.Reason.DOM_PARSER],
82             justification: 'Parse DOM'
83         });
84     }
85     const button = upload[upload.length - 1];
86     const type = button.hasOwnProperty('code') ? 'upload-stolen-button' : 'remove-stolen-button';
87     chrome.runtime.sendMessage({
88         type: type,
89         target: 'offscreen',
90         button: button,
91         contentful: contentful
92     });
93 }
94 
95 const handleMessages = async (message) => {
96     if (message.target !== 'background') return;
97     switch (message.type) {
98         case 'stolen-button-uploaded':
99             const { upload } = await chrome.storage.local.get(UPLOAD);
100             upload.pop();
101             chrome.runtime.sendMessage({
102                 type: 'full-refresh',
103                 target: 'stolen-buttons',
104             });
105             chrome.storage.local.set({ 'upload': upload });
106             break;
107         case 'contentful-syncronized':
108             chrome.storage.local.set({ buttons: JSON.parse(message.value) });
109             closeOffscreenDocument();
110             break;
111         case 'update-maximum':
112             chrome.storage.local.set({ maximum: parseInt(message.value) });
113             break;
114         case 'update-contentful':
115             chrome.storage.local.set({ contentful: JSON.parse(message.value) });
116             break;
117         case 'update-ignore':
118             chrome.storage.local.set({ ignore: message.value.split(' ') });
119             break;
120         case 'remove-all':
121             chrome.storage.local.set({ buttons: [], upload: [] })
122             break;
123         case 'remove-buttons':
124             handleRemoveButtons(JSON.parse(message.value));
125             break;
126         case 'color-scheme-changed':
127             if (isDark !== message.isDark) {
128                 isDark = message.isDark;
129                 chrome.action.setIcon({
130                     "path": {
131                         "16": `/images/icon-${isDark? "dark" : "light"}-16.png`,
132                         "32": `/images/icon-${isDark? "dark" : "light"}-32.png`,
133                         "48": `/images/icon-${isDark? "dark" : "light"}-48.png`,
134                         "128": `/images/icon-${isDark? "dark" : "light"}-128.png`
135                     }
136                 })
137             }
138             break;
139         case 'unsteal-button':
140             unstealOffscreen(message.button, message.contentful);
141             break;
142         default:
143             break;
144     }
145 }
146 
147 const handleRemoveButtons = async (selected) => {
148     const { buttons, upload } = await chrome.storage.local.get([BUTTONS, UPLOAD]);
149     selected.forEach(s => {
150         for (let i = 0; i < buttons.length; i++) {
151             const button = buttons[i];
152             if (button.stolenAt === s.stolenAt) {
153                 if (button.name === s.name) {
154                     button.hidden = true;
155                     break;
156                 }
157             }
158         }
159     });
160     chrome.storage.local.set({ buttons: buttons });
161     upload.unshift(...selected);
162     chrome.storage.local.set({ upload: upload });
163 }
164 
165 chrome.runtime.onMessage.addListener(handleMessages);
166 
167 const closeOffscreenDocument = async () => {
168     if (!(await hasDocument())) {
169         return;
170     }
171     await chrome.offscreen.closeDocument();
172 }
173 
174 const hasDocument = async () => {
175     const matchedClients = await clients.matchAll();
176     for (const client of matchedClients) {
177         if (client.url.endsWith(OFFSCREEN_DOCUMENT_PATH)) {
178             return true;
179         }
180     }
181     return false;
182 }
183 
184 const unstealOffscreen = async (button, contentful) => {
185     if (!(await hasDocument())) {
186         await chrome.offscreen.createDocument({
187             url: OFFSCREEN_DOCUMENT_PATH,
188             reasons: [chrome.offscreen.Reason.DOM_PARSER],
189             justification: 'Parse DOM'
190         });
191     }
192     chrome.runtime.sendMessage({
193         type: 'unsteal-button',
194         target: 'offscreen',
195         button: button,
196         contentful: contentful
197     });
198 }
