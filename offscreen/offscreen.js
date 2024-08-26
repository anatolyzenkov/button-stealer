1 const CNTFL_MGMT_API_KEY = 'contentManagementApiKey';
2 const CNTFL_DLVR_API_KEY = 'contentDeliveryApiKey';
3 const CNTFL_SPACE_ID = 'spaceId';
4 const CNTFL_TYPE_ID = 'contentTypeId';
5 
6 const upload = async (button, contentful) => {
7     const content_management_api_key = contentful[CNTFL_MGMT_API_KEY];
8     const space_id = contentful[CNTFL_SPACE_ID];
9     const content_type_id = contentful[CNTFL_TYPE_ID];
10     const environment_id = 'master';
11 
12     const client = createClient({
13         accessToken: content_management_api_key
14     });
15     let error = false;
16     await client.getSpace(space_id)
17         .then((space) => space.getEnvironment(environment_id))
18         .then((env) => env.createEntry(content_type_id, {
19             fields: {
20                 name: { 'en-US': button.name },
21                 code: { 'en-US': button.code },
22                 source: { 'en-US': button.source },
23                 text: { 'en-US': button.text }
24             }
25         }))
26         .then((entry) => entry.publish())
27         .then((entry) => console.log(`Entry ${entry.sys.id} published.`))
28         .catch(e => {
29             console.log(e.message);
30             error = true;
31         })
32         .finally((e) => {
33             if (!error) {
34                 sendToBackground();
35             }
36         });
37 }
38 
39 const find = async (name, cntfl) => {
40     const content_delivery_api_key = cntfl[CNTFL_DLVR_API_KEY];
41     const space_id = cntfl[CNTFL_SPACE_ID];
42     const content_type_id = cntfl[CNTFL_TYPE_ID];
43     const client = contentful.createClient({
44         accessToken: content_delivery_api_key,
45         space: space_id
46     });
47     const entries = await client.getEntries({
48         content_type: content_type_id,
49         select: 'sys.createdAt',
50         order: '-sys.createdAt',
51         locale: 'en-US',
52         'fields.name[match]': name
53     })
54     return entries.items.map(entry => entry.sys.id);
55 }
56 
57 const remove = async (button, contentful) => {
58     const ids = await find(button.name, contentful);
59     if (ids.length === 0) {
60         sendToBackground();
61         return;
62     }
63     const content_management_api_key = contentful[CNTFL_MGMT_API_KEY];
64     const space_id = contentful[CNTFL_SPACE_ID];
65     const environment_id = 'master';
66     const client = createClient({
67         accessToken: content_management_api_key,
68     });
69 
70     let error = false;
71     await client.getSpace(space_id)
72         .then((space) => space.getEnvironment(environment_id))
73         .then((env) => env.getEntry(ids[0]))
74         .then((entry) => entry.unpublish())
75         .then((entry) => entry.delete())
76         .then(() => console.log('Entry deleted.'))
77         .catch(e => {
78             console.log(e.message);
79             error = true;
80         })
81         .finally((e) => {
82             if (!error) {
83                 sendToBackground();
84             }
85         });
86 }
87 
88 const unsteal = async (button, contentful) => {
89     const ids = await find(button.name, contentful);
90     if (ids.length === 0) {
91         sendToBackground();
92         return;
93     }
94     const content_management_api_key = contentful[CNTFL_MGMT_API_KEY];
95     const space_id = contentful[CNTFL_SPACE_ID];
96     const environment_id = 'master';
97     const client = createClient({
98         accessToken: content_management_api_key,
99     });
100 
101     let error = false;
102     await client.getSpace(space_id)
103         .then((space) => space.getEnvironment(environment_id))
104         .then((env) => env.getEntry(ids[0]))
105         .then((entry) => entry.unpublish())
106         .then((entry) => entry.delete())
107         .then(() => console.log('Entry unstealed.'))
108         .catch(e => {
109             console.log(e.message);
110             error = true;
111         })
112         .finally((e) => {
113             if (!error) {
114                 sendToBackground();
115             }
116         });
117 }
118 
119 const sync = async (cntfl) => {
120     const content_delivery_api_key = cntfl[CNTFL_DLVR_API_KEY];
121     const space_id = cntfl[CNTFL_SPACE_ID];
122     const content_type_id = cntfl[CNTFL_TYPE_ID];
123     const client = contentful.createClient({
124         accessToken: content_delivery_api_key,
125         space: space_id
126     });
127     const buttons = [];
128     let skip = 0;
129     let total = Infinity;
130     while (skip < total) {
131         const entries = await client.getEntries({
132             content_type: content_type_id,
133             locale: 'en-US',
134             order: '-sys.createdAt',
135             select: 'fields, sys.createdAt',
136             skip: skip
137         });
138         total = entries.total;
139         skip += entries.limit;
140         buttons.push(...entries.items);
141     }
142     const value = buttons.map((button, i) => {
143         return {
144             id: buttons.length - i - 1,
145             name: button.fields.name,
146             code: button.fields.code,
147             source: button.fields.source,
148             text: button.fields.text,
149             stolenAt: button.sys.createdAt,
150         }
151     });
152     chrome.runtime.sendMessage({
153         type: 'contentful-syncronized',
154         target: 'background',
155         value: JSON.stringify(value)
156     });
157 }
158 
159 const handleMessages = async (message) => {
160     if (message.target !== 'offscreen') return false;
161     switch (message.type) {
162         case 'upload-stolen-button':
163             await upload(message.button, message.contentful);
164             break;
165         case 'remove-stolen-button':
166             await remove(message.button, message.contentful);
167             break;
168         case 'unsteal-button':
169             await unsteal(message.button, message.contentful);
170             break;
171         case 'full-sync':
172             await sync(message.contentful);
173             break;
174         default:
175             return false;
176     }
177 }
178 
179 const sendToBackground = () => {
180     chrome.runtime.sendMessage({
181         type: 'stolen-button-uploaded',
182         target: 'background'
183     });
184 }
185 
186 chrome.runtime.onMessage.addListener(handleMessages);
