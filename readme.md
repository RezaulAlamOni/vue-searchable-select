# Vue Searchable Select

A Vue 3 component for searchable dropdowns with support for API-based search with new create and option.

## Installation

```bash
npm install @oni93/vue-searchable-select
```
## Usage ##
```bash
import { createApp } from 'vue';
import VueSearchableSelect from '@oni93/vue-searchable-select';

const app = createApp(App);
app.use(VueSearchableSelect);
app.mount('#app');


```
### Use for default options
```bash
<vue-searchable-select
    :newTag="false"
    :options="options"
    :placeholder="'Select Supplier'"
    @input="getSelectedObject">
</vue-searchable-select>
```
### Uses api search
```bash
<vue-searchable-select
    :newTag="true"
    :apiUrl="'products-items'"
    :placeholder="'Search Medicine Item '"
    @input="getSelectedObject">
</vue-searchable-select>
```

## Options stricture
```bash
 options = [
              {
                text: 'name',
                id: 1
              },
              {
                text: 'name1',
                id: 2
              },
              {
                text: 'name2',
                id: 3
              }
            ];
           
newTag user for api search. if its true and api componet user for
api search then new tag will be created.


For api search apiUrl is required and options not passing.

@input event pass the selected object.

```
```bash

visit my profile

https://github.com/RezaulAlamOni/vue-searchable-select

```
