<template>
  <div class="autocomplete position-relative">
    <input
        type="text"
        class="form-control"
        :class="(isOpen && filteredOptions.length) ? 'open-input-border' : 'regular-input-border'"
        v-model="searchText"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keyup="filteredOption"
        @keydown.up.prevent="prevResult"
        @keydown.down.prevent="nextResult"
        @keydown.enter.prevent="selectResult"
        :placeholder="placeholder"
        ref="searchInput"
    />
    <span v-if="searchText" class="clear-icon" @click="clearSearch">&#10005;</span> <!-- Cross Icon -->
    <span class="arrow-icon" @click="toggleDropdown">
            <i v-if="isOpen" class="fa fa-arrow-up"></i>
            <i v-else class="fa fa-arrow-down"></i>
        </span> <!-- Arrow Icon -->
    <ul v-if="isOpen && filteredOptions.length" class="list-group position-absolute w-100">
      <li
          v-for="(option, index) in filteredOptions"
          :key="option.id"
          class="list-group-item list-group-item-action"
          :class="{ active: hoveredIndex === index }"
          @mousedown.prevent="selectOption(option)"
          @mouseenter="hoveredIndex = index"
      >
        {{ option.text }}
        {{ option.newTag == 1 ? " (new)" : '' }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "vue-searchable-select",
  props: {
    name: String,
    options: {
      type: [Array, Object],
      required: true,
      default: []
    },
    optionKey: {
      type: String,
      default: 'id',
    },
    apiUrl: {
      type: String,
      default: null,
    },
    optionValue: {
      type: String,
      default: 'name',
    },
    placeholder: {
      type: String,
      default: 'Select Item',
    },
    selected: {
      type: [String, Number],
      default: '',
    },
    newTag: {
      type: Boolean,
      default: true,
    },
    minLength: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      isOpen: false,
      searchText: '',
      hoveredIndex: 0,
      filteredOptions: [],
    };
  },
  watch: {
    selected(value) {
      this.searchText = this.options.find(
          (option) => option[this.optionKey] === value
      )?.[this.optionValue] || '';
    },
  },
  methods: {
    filteredOption() {
      let _this = this;
      const search = this.searchText.toLowerCase();

      if (this.options.length > 0) {
        this.filteredOptions = _this.options.filter((option) => {
          console.log(option.text);
          let text = option.text.toLowerCase(); // Convert option text to lowercase
          return text.includes(search);
        });
        return;
      }


      if (!this.searchText && search.length < this.minLength) return [];
      axios.get(_this.apiUrl, {params: {search: search}})
          .then(response => {
            _this.filteredOptions = response.data.medicineItems ?? [];
            if (_this.filteredOptions.length == 0 && _this.searchText != '') {
              _this.filteredOptions = [
                {
                  generic_name: _this.searchText,
                  item_name: _this.searchText,
                  pack_type: null,
                  strength: null,
                  id: _this.searchText,
                  text: _this.searchText,
                  newTag: true // add additional parameters
                }
              ]
            }
          })
          .catch(error => {
            console.log(error.message())
          });

    },
    onFocus() {
      this.isOpen = true;
    },
    onBlur() {
      setTimeout(() => {
        this.isOpen = false;
      }, 200);
    },
    onInput() {
      this.isOpen = true;
      this.hoveredIndex = 0;
    },
    nextResult() {
      if (this.hoveredIndex < this.filteredOptions.length - 1) {
        this.hoveredIndex++;
      }
    },
    prevResult() {
      if (this.hoveredIndex > 0) {
        this.hoveredIndex--;
      }
    },
    selectResult() {
      if (this.hoveredIndex !== -1) {
        this.selectOption(this.filteredOptions[this.hoveredIndex]);
      }
    },
    selectOption(option) {
      this.searchText = option.text;
      this.isOpen = false;
      this.filteredOptions = [];
      this.$emit('input', option);
    },
    clearSearch() {
      this.searchText = '';
      this.filteredOptions = [];
      this.isOpen = false;
      this.$emit('input', null);
    },
    toggleDropdown() {
      if (!this.isOpen) {
        this.$refs.searchInput.focus();
        this.isOpen = true;
      } else {
        this.isOpen = false;
      }
    }
  },

};
</script>

<style scoped>
.autocomplete {
  position: relative;

  .regular-input-border {
    border-radius: 3px;
  }

  .open-input-border {
    border-radius: 3px 3px 0 0;
  }

  .clear-icon {
    position: absolute;
    top: 50%;
    right: 35px; /* Adjust according to your design */
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 16px;
    color: #999;
  }

  .arrow-icon {
    position: absolute;
    top: 50%;
    right: 10px; /* Adjust according to your design */
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 16px;
    color: #999;
  }
}

.list-group {
  z-index: 1;
  opacity: 1;
  border-radius: 0 0 3px 3px;
  max-height: 250px;
  overflow: auto;

  .list-group-item {
    cursor: pointer;
    background-color: rgba(243, 251, 252, 0.99);

    &:hover {
      background-color: rgba(167, 248, 178, 0.99);
      color: #4d4d4d;
      border: 1px solid #d5d5d5;
    }

    &.active {
      background-color: rgba(167, 248, 178, 0.99);
      color: #4d4d4d;
      border: 1px solid #d5d5d5;
    }
  }
}
</style>
