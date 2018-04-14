function getComponent(modu) {
  return import(/* webpackChunkName: "player" */ modu).then(_ => {
    }).catch(error => 'An error occurred while loading the component');
}
export default getComponent;
    