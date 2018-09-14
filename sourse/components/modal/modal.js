 var modal = {
  template: `<Modal
        title="{{ modal.title }}"
        v-model="true"
        class-name="vertical-center-modal">
        <slot></slot>
    </Modal>`,
  props: {
    modal: {
      type: Object,
      default: {},
      status:false
    }
  },
  create(){
    console.log(this.modal)
  }
}