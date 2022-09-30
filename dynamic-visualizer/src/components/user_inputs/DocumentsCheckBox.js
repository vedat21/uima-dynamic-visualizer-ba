import {useEffect, useState} from "react";
import useGetData from "../../api_crud/useGetData";
import {apiEndpoints, usedColors} from "../../helper/envConst";
import Typography from "@mui/material/Typography";
import {Checkbox, FormControlLabel, IconButton, TextField} from "@mui/material";

function DocumentsCheckBox(props) {

  const {response, loading} = useGetData(
      apiEndpoints.basis + apiEndpoints.documents + apiEndpoints.all
      + apiEndpoints.namesandgroup);

  const [groupsOptions, setGroupsOptions] = useState({});
  const [onlyNamesOptions, setOnlyNamesOptions] = useState([]);
  const [searchFieldValue, setSearchFieldValue] = useState("");

  // getting document names and their group name
  useEffect(async () => {
    let groupsOptionsCopy = {};
    if (!loading) {
      console.log("JSAMAN")
      response.forEach((document) => {
        if (!onlyNamesOptions.includes(document.name)) {
          onlyNamesOptions.push(document.name);
        }
        groupsOptionsCopy[document.group] = [];
      })

      response.forEach((document) => {
        if (!groupsOptionsCopy[document.group].includes(document.name)) {
          groupsOptionsCopy[document.group].push(document.name)
        }
      })
      setGroupsOptions(groupsOptionsCopy);
    }
  }, [loading, response])

  /**
   * for selecting/unselecting parent checkbox
   * @param groupName
   */
  function handleSelectedGroup(groupName) {
    let allSelected = true;

    groupsOptions[groupName].forEach((item) => {
      if (!props.selectedDocuments.includes(item)) {
        allSelected = false;
      }
    })

    allSelected ? props.handleUnselectGroup(groupsOptions[groupName])
        : props.handleSelectGroup(groupsOptions[groupName])
  }

  return (
      <>
        <Typography align="center" variant="h3">UIMA Documents</Typography>
        <TextField
            sx={{backgroundColor: usedColors.secondary}}
            onChange={event => setSearchFieldValue(event.target.value)}
            variant="outlined" label="Search"
            fullWidth
            autoComplete="off"
            size="small"
            label="Search Documents"
        >
          <IconButton>
          </IconButton>
        </TextField>
        <br/>

        {searchFieldValue.length == 0 ?
            loading === false && Object.entries(groupsOptions).map(
                (group) => (
                    <>
                      <div key={group[0]}>
                        <FormControlLabel sx={{transform: "scale(1.2)"}}
                                          control=
                                              {<Checkbox style={{
                                                color: usedColors.secondary,
                                              }}
                                                         checked={group[1].every(
                                                             item => props.selectedDocuments.includes(
                                                                 item))}
                                              />}
                                          label={group[0]}
                                          onChange={(event) => handleSelectedGroup(
                                              group[0])}
                        />
                      </div>
                      {group[1].sort((a, b) => a.localeCompare(b)).map(
                          (item, index) => (
                              <div key={index}>
                                <FormControlLabel
                                    sx={{paddingLeft: "25px"}}
                                    control=
                                        {<Checkbox style={{
                                          color: usedColors.secondary,
                                        }}
                                                   checked={props.selectedDocuments.includes(
                                                       item)}/>}
                                    label={item}
                                    onChange=
                                        {(event) => props.handleSelectedDocuments(
                                            event,
                                            item)}
                                >
                                </FormControlLabel>
                              </div>
                          ))}
                    </>
                ))
            :
            onlyNamesOptions.filter(
                name => name.toLowerCase().match(searchFieldValue.toLowerCase())).sort(
                (a, b) => a.localeCompare(b)).map((item, index) => (
                <div key={index}>
                  <FormControlLabel
                      sx={{paddingLeft: "25px"}}
                      control=
                          {<Checkbox style={{
                            color: usedColors.secondary,
                          }}
                                     checked={props.selectedDocuments.includes(
                                         item)}/>}
                      label={item}
                      onChange=
                          {(event) => props.handleSelectedDocuments(
                              event,
                              item)}
                  >
                  </FormControlLabel>
                </div>
            ))}
      </>
  );
}

export default DocumentsCheckBox