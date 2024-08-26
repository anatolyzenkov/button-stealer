1 const MAXIMUM = 'maximum';
2 const CNTFL_MGMT_API_KEY = 'contentManagementApiKey';
3 const CNTFL_DLVR_API_KEY = 'contentDeliveryApiKey';
4 const CNTFL_SPACE_ID = 'spaceId';
5 const CNTFL_TYPE_ID = 'contentTypeId';
6 const CONTENTFUL = 'contentful';
7 const BUTTONS = 'buttons';
8 const IGNORE = 'ignore';
9 const maximumInput = document.getElementById(MAXIMUM);
10 const maximumValue = document.getElementById('maximumValue');
11 const ignoreInput = document.getElementById(IGNORE);
12 const mgmtApiKeyInput = document.getElementById(CNTFL_MGMT_API_KEY);
13 const dlvrApiKeyInput = document.getElementById(CNTFL_DLVR_API_KEY);
14 const spaceIdInput = document.getElementById(CNTFL_SPACE_ID);
15 const typeIdInput = document.getElementById(CNTFL_TYPE_ID);
16 const contentfulForm = document.getElementById(`${CONTENTFUL}-form`);
17 
18 const saveContentful = () => {
19     const formData = new FormData(contentfulForm);
20     sendToBackground(`update-${CONTENTFUL}`, JSON.stringify({
21         contentManagementApiKey: formData.get(CNTFL_MGMT_API_KEY),
22         contentDeliveryApiKey: formData.get(CNTFL_DLVR_API_KEY),
23         spaceId: formData.get(CNTFL_SPACE_ID),
24         contentTypeId: formData.get(CNTFL_TYPE_ID),
25     }));
26 }
27 
28 const updateContentful = (contentful) => {
29     mgmtApiKeyInput.value = contentful.contentManagementApiKey;
30     dlvrApiKeyInput.value = contentful.contentDeliveryApiKey;
31     spaceIdInput.value = contentful.spaceId;
32     typeIdInput.value = contentful.contentTypeId;
33 }
34 
35 const saveMaximum = () => {
36     sendToBackground(`update-${MAXIMUM}`, maximumInput.value);
37 }
38 
39 const updateMaximum = (maximum) => {
40     maximumInput.value = maximum;
41     maximumValue.innerText = maximum;
42 }
43 
44 const saveIgnore = () => {
45     sendToBackground(`update-${IGNORE}`, ignoreInput.value);
46 }
47 
48 const updateIgnore = (ignore) => {
49     ignoreInput.value = ignore.join(' ');
50 }
51 
52 const updateButtons = (buttons) => {
53     let stat;
54     let length = 0;
55     buttons.map(button => button.hidden ? length : length++);
56     switch (true) {
57         case length === 1:
58             stat = "One button already stolen"
59             break;
60         case length > 1:
61             stat = `${length} buttons stolen`
62             break;
63         default:
64             stat = "No buttons stolen yet"
65             break;
66     }
67     document.getElementById('stat').innerText = stat;
68     document.getElementById('buttons').innerHTML = '';
69     for (let i = 0; i < Math.min(50, buttons.length); i++) {
70         const button = buttons[i];
71         if (button.hidden) continue;
72         const div = document.createElement('div');
73         div.classList.add('button-wrapper');
74         div.innerHTML = button.code;
75         document.getElementById('buttons').append(div);
76     }
77 }
78 
79 const getData = async () => {
80     const { maximum, contentful, ignore, buttons } = await chrome.storage.local.get([MAXIMUM, CONTENTFUL, IGNORE, BUTTONS]);
81     updateMaximum(maximum);
82     updateContentful(contentful);
83     updateIgnore(ignore);
84     updateButtons(buttons)
85 }
86 
87 const sendToBackground = (type, value) => {
88     chrome.runtime.sendMessage({
89         type,
90         value,
91         target: 'background'
92     });
93 }
94 let maximumDelay = -1;
95 let contentfulDelay = -1;
96 let ignoreDelay = -1;
97 
98 maximumInput.addEventListener('input', () => {
99     maximumValue.innerText = maximumInput.value;
100     clearTimeout(maximumDelay);
101     maximumDelay = setTimeout(saveMaximum, 500);
102 });
103 
104 [mgmtApiKeyInput, dlvrApiKeyInput, spaceIdInput, typeIdInput].forEach(input => {
105     input.addEventListener('input', () => {
106         clearTimeout(contentfulDelay);
107         contentfulDelay = setTimeout(saveContentful, 500);
108     });
109 })
110 
111 document.getElementById('remove-all').addEventListener('click', () => {
112     if (window.confirm("Remove buttons?") == true) {
113         chrome.runtime.sendMessage({
114             type: 'remove-all',
115             target: 'background'
116         });
117     }
118 });
119 
120 ignoreInput.addEventListener('input', ()=> {
121     clearTimeout(ignoreDelay);
122     contentfulDelay = setTimeout(saveIgnore, 500);
123 });
124 
125 document.getElementById('switch').addEventListener('click', ()=> {
126     document.body.classList.toggle('show-settings');
127 });
128 
129 const unstealButton = () => {
130     chrome.runtime.sendMessage({
131         type: 'unsteal-button',
132         target: 'background'
133     });
134 }
135 
136 document.getElementById('unsteal').addEventListener('click', unstealButton);
137 
138 getData();
