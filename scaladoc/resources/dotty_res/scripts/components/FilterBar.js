/**
 * @typedef { import("./Filter").Filter } Filter
 */

 class FilterBar extends Component {
   constructor(props) {
     super(props);

     this.refs = {
       elements: findRefs(".documentableElement"),
       filterBar: findRef(".documentableFilter"),
     };

     this.state = {
       filter: new Filter("", {}, this.refs.elements, true),
       isVisible: false,
       selectedPill: "",
     };

     this.inputComp = new Input({ onInputChange: this.onInputChange });
     this.listComp = new DocumentableList({
       filter: this.state.filter,
     });
     this.filterGroupComp = new FilterGroup({
       filter: this.state.filter,
       onFilterToggle: this.onFilterToggle,
       onGroupSelectChange: this.onGroupSelectChange,
       onFilterVisibilityChange: this.onFilterVisibilityChange,
       onPillClick: this.onPillClick,
       onPillCollapse: this.onPillCollapse,
     });

     this.render();
   }

   onInputChange = (value) => {
     this.setState((prevState) => ({
       filter: prevState.filter.onInputValueChange(value),
     }));
     this.onChangeDisplayedElements();
   };

   onGroupSelectChange = (key, isActive) => {
     this.setState((prevState) => ({
       filter: prevState.filter.onGroupSelectionChange(key, isActive),
     }));
   };

   onClearFilters = () => {
     this.inputComp.inputRef.value = "";
     this.setState((prevState) => ({
       filter: prevState.filter.onInputValueChange(""),
     }));
   };

   onFilterVisibilityChange = () => {
     this.setState((prevState) => ({ isVisible: !prevState.isVisible }));
   };

   onFilterToggle = (key, value) => {
     this.setState((prevState) => ({
       filter: prevState.filter.onFilterToggle(key, value),
     }));
     this.onChangeDisplayedElements();
   };

   onPillClick = (key) => {
     this.setState((prevState) => ({
       filter: prevState.filter,
       selectedPill: key,
     }));
   };

   onPillCollapse = () => {
     this.setState((prevState) => ({
       filter: prevState.filter,
       selectedPill: "",
     }));
   };

   onChangeDisplayedElements = () => {
     const elementsDisplayed = this.refs.elements.filter(
       (member) => member.style.display !== "none",
     );
     const noResultContainer = document.querySelector("#no-results-container");
     if (elementsDisplayed.length === 0 && !noResultContainer) {
       const emptySpace = document.querySelector("#Value-members");
       emptySpace.insertAdjacentHTML(
         // TODO ścieżka do poprawki
         "beforeend",
         `<div id='no-results-container'>
          <img src="./images/no-results.svg" alt="Sick face" >
          <h2 class='h200 no-result-header'>No results match your filter criteria</h2>
          <p class='no-result-content'>Try adjusting or clearing your filters<br>to display better result</p>
          <button class='clearButton label-only-button'>Clear all filters</button>
        </div>`,
       );
     }
   };

   render() {
     if (this.refs.filterBar) {
       if (this.state.isVisible) {
         this.refs.filterBar.classList.add("active");
       } else {
         this.refs.filterBar.classList.remove("active");
       }
     }

     this.listComp.render({ filter: this.state.filter });
     this.filterGroupComp.render({
       filter: this.state.filter,
       selectedPill: this.state.selectedPill,
     });
   }
 }

 window.addEventListener("dynamicPageLoad", () => {
   new FilterBar();
 });

 document.addEventListener("click", (e) => {
   const isClearButton = e.target.classList.contains("clearButton");
   if (isClearButton) new FilterBar().onClearFilters();
 });

