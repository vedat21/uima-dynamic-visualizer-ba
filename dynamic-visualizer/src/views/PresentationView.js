import React, {useState, useEffect} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import {v4 as uuid} from 'uuid';

// custom modules
import TopBar from "../components/user_inputs/TopBar";
import VisualizationLayout
  from "../components/visualizations/VisualizationLayout";
import {usedColors, apiEndpoints} from "../helper/envConst"
import savePresentation from "../api_crud/savePresentation";
import useGetData from "../api_crud/useGetData";

/**
 * presentation view of visualizations
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function PresentationView(props) {

  // for pdf download needed
  const printRef = React.useRef();
  // id of presentation is url parameter. Presentation page should only be accessed via routing.
  const {id} = useParams();

  // title of presentation
  const [title, setTitle] = useState("");
  // enables/disables editing of presentation
  const [editable, setEditable] = useState(false);
  // stores the visualizations
  const [visualizations, setVisualizations] = useState([]);
  // stores the layout of the visualizations
  const [layout, setLayout] = useState([])
  // stores all documents that are selected
  const [selectedDocuments, setSelectedDocuments] = useState([])

  // to prevent saving layout with empty data
  const [dataLoaded, setDataLoaded] = useState(false);

  // load existing presentation from api
  useEffect(() => {

    const fetchData = async () => {
      try {
        await axios.get(
            apiEndpoints.basis + apiEndpoints.presentations + id).then(
            (response) => {
              setLayout(response.data.layout);
              setVisualizations(response.data.visualizations);
              setTitle(response.data.title);
              setSelectedDocuments(response.data.documents);
              setDataLoaded(true);
            });
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [id])

  //     // set background color of webpage
  document.body.style.background = usedColors.secondary;

  /**
   * to delete a component from view
   * @param component
   */
  function onDeleteComponentClicked(component) {
    saveLayout();
    // id of clicked component
    const id = component.currentTarget.parentElement.parentElement.getAttribute(
        "id");

    // deletes component with id from visualizations
    setVisualizations(visualizations.filter(element => element.id !== id))
  }

  /**
   * adds component to view
   */
  function addVisualization(selectedTypes, selectedAttribute, selectedVisualization) {
    saveLayout();
    // if selectedTypes only contains one element then dont join
    selectedTypes = Array.isArray(selectedTypes) ? selectedTypes.join()
        : selectedTypes;

    // difference between chart component and other
    if (selectedVisualization.includes("chart") || selectedVisualization.includes("cloud")) {

      const reqeuestParamSum = (selectedVisualization.includes("horizon") ||  selectedVisualization.includes("stackedarea"))  ? apiEndpoints.sumbydate : apiEndpoints.sum

      const dataToAdd = {
        id: uuid(),
        component: selectedVisualization,
        // bei visaulisierung mit 3 werten sumbydate wählen
        url: apiEndpoints.basis + reqeuestParamSum + selectedTypes + apiEndpoints.requestParamAttribute + selectedAttribute
            + apiEndpoints.requestParamNames,
        limit: 50,
        label: selectedTypes,
      };
      /* if bodydata is null then init list with only added data. else add to bodydata.
          (using concat to trigger rerender) */
      visualizations === null ? setVisualizations([dataToAdd])
          : setVisualizations(visualizations.concat([dataToAdd]))
    } else {
      const dataToAdd = {
        id: uuid(),
        component: selectedVisualization,
        content: "x"
      };
      /* if bodydata is null then init list with only added data. else add to bodydata.
         (using concat to trigger rerender) */
      visualizations === null ? setVisualizations([dataToAdd])
          : setVisualizations(visualizations.concat([dataToAdd]));
    }

  }

  /**
   * saves layout global. Is called when visualizations are added or removed.
   */
  function saveLayout() {
    setLayout(window.$localVisualizationLayout);
  }

  /**
   * called when edit button is pressed. disables/enables editormodus and saves presentation to database.
   */
  const onEditableClicked = (changeButton=true) => {

    if (!dataLoaded){
      return;
    }

    saveLayout();
    const presentation =
        {
          "id": id,
          "title": title,
          "layout": window.$localVisualizationLayout,
          "visualizations": visualizations,
          "documents": selectedDocuments
        }
    savePresentation(presentation);

    if (changeButton){
      setEditable(!editable);
    }
  }

  const handleSelectedDocuments = (event, item) => {
    let updatedList = [...selectedDocuments];
    if (event.target.checked) {
      updatedList = [...selectedDocuments, item];
    } else {
      updatedList.splice(selectedDocuments.indexOf(item), 1);
    }
    setSelectedDocuments(updatedList);
  };

  /**
   * sets all chekcboxes of items to true
   * @param items
   */
  function handleSelectGroup(items) {
    let newItems = [];
    items.forEach((item) => {
      if (!selectedDocuments.includes(item)) {
        newItems.push(item);
      }
    })
    setSelectedDocuments(selectedDocuments.concat(newItems));
  }

  /**
   * sets all chekcboxes of items to false
   * @param items
   */
  function handleUnselectGroup(items) {
    let oldItems = [];
    items.forEach((item) => {
      if (selectedDocuments.includes(item)) {
        oldItems.push(item)
      }
    })
    setSelectedDocuments(
        selectedDocuments.filter(item => !oldItems.includes(item)))
  }

  /**
   * on edit title of presentation
   * @param event
   */
  function editTitle(event) {
    saveLayout();
    if (event.keyCode === 13) {
      setTitle(event.target.value);
    }
  }

  return (
      <div ref={printRef}>
        <TopBar
            printRef={printRef}
            editable={editable} onEditableClicked={onEditableClicked}
            addVisualization={addVisualization}
            title={title} editTitle={editTitle}
            useCase="presentation"
            selectedDocuments={selectedDocuments}
            handleSelectedDocuments={handleSelectedDocuments}
            handleUnselectGroup={handleUnselectGroup}
            handleSelectGroup={handleSelectGroup}
        />
        <VisualizationLayout
            onKeyPress={(event) => console.log(event)}
            editable={editable}
            visualizations={visualizations}
            layout={layout}
            onDeleteComponentClicked={onDeleteComponentClicked}
            addVisualization={addVisualization}
            selectedDocuments={selectedDocuments}
        />
      </div>
  )
}

export default PresentationView;
