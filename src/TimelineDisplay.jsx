import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { useState, useEffect} from 'react'
import "./TimelineDisplay.css";
import 'boxicons' // icons 
import FloatingDescriptionBox from './FloatingDescriptionBox.jsx';
import EventCard from './EventCard.jsx';

export default function TimelineDisplay({initialItems, initialGroups}) { 
    const [openModal, setOpenModal]= useState(null) // ItemID for open Description Boxes
    const [groups, setGroups] = useState(initialGroups) // Groups/Arcs
    const [items, setItems] = useState(initialItems) // 
    const [nextOpenId, setNextOpenId] = useState(items.length+1) // 
    const [tagList, setTagList] = useState([]) // 
    const [isEditing, setIsEditing]= useState(false) // ItemID for open Description Boxes
    
    const group_colors = ['red', 'orange', 'yellow', 'lightgreen', 'darkgreen', 'lightblue', 'darkblue', 'purple', 'pink', 'brown', 'grey', 'gold']
    const hex_colors = ['#eb2f29','#f69548','#fecb18','#7ac142','#2bb6e6','#00a34d','#015396','#914499','#db74ae','#a15c2f','#7c878e','#978e2e'] 
    // const boxicon_names = ['radio-circle','cake', 'star', 'graduation', 'bullseye', 'certification', 'circle', 'heart'] // For Future Customization
    
    /**
     *  Creates New Blank Item Inside groupId, sets its time to _time
     * @param {Int16Array} _groupId 
     * @param {Timestamp} _time 
     */
    function createItem(_groupId, _time){
      const newItem = {
        id: nextOpenId,
        title: ("Event " + nextOpenId),
        group: _groupId,
        start_time: _time,
        end_time: _time + 3600000, 
        itemProps: {
          style: {
            color: "white",
            background: '#00000000',
            border: '0px'
          }, 
          primaryColor: '#00000000',
          longDescription: "Description",
          tags: []
        }
      }
      setNextOpenId((prev) => {return (prev + 1)});
      setItems((prev) => [...prev, newItem])
    }


    /**
     * Refreshes List of Tags, using Items array useState
     */
    function refreshTagList() { 
      let allTags = []
      items.forEach( (item) => { item.itemProps.tags.forEach(tag => allTags.push(tag))})
      setTagList([...new Set(allTags)])
    }

    /**
     * @param {Int16Array} itemId 
     * @param {Int16Array} dragTime 
     * @param {*} newGroupOrder 
     */
    function moveItem(itemId, dragTime, newGroupOrder) { 
      let newItem = { ... getItemById(itemId) }
      newItem.start_time = dragTime
      newItem.end_time = dragTime + 3600000
      replaceItem(itemId, newItem)
    }

    function replaceItem(itemId, newItem) {
      removeItemById(itemId)
      setItems((prev) => { return [... prev, newItem]})
    }

    /**
     *  Removes item of id from Items useState
     * @param {Int16Array} id 
     */
    function removeItemById(id) {
      const filteredItems = items.filter(item => item.id !== id)
      setItems((prev) => { return filteredItems})
    }

    /**
     * @param {Int16Array} id 
     * @returns Item reference or undefined
     */
    function getItemById(id) {
      return items.filter(item => item.id === id).pop();
    }

    function selectItem(itemId, e, time) { // spawn a Description box
      console.log('selectitem')
      setOpenModal(itemId)
    }

    function deselectItem(e) { //Delete all Description boxes when deselected
      console.log('deselectitem')
      setOpenModal(null)
      console.log("openmodal", openModal)
    }
    // Requires GroupColours
    function idToColorClassName(_group_id){ 
      if (_group_id < 0){ // BLANK PADDING ROW
        return "blank"
      } else {
        return group_colors[_group_id%group_colors.length]
      }
    }
    function idToHex(_group_id){ 
      return hex_colors[_group_id%hex_colors.length]
    }
    function idToGroupName(_group_id){ 
      // console.log(_group_id)
      return groups.find((gr) => {return gr.id == _group_id}).title
    }

    /**
     * 
     * @param {Group Object} param0 
     * @returns JSX object containing that group's component to be rendered. 
     */
    function CustomGroupRenderer ({ group }){
      if (group.id < 0){
        return (
        <div class="group_box" >
          <span>{group.title}</span>
        </div>
        );
      } else {
        return (
          <div class="group_box" >
            <span>{group.title}</span>
            <span><box-icon name='dots-horizontal-rounded' color="white"></box-icon></span>
          </div>
        );
      }
    };

    /**
     * 
     * @param {Params} param0 
     * @returns JSX object containing that group's component to be rendered. 
     */
    function defaultItemRenderer ({
        item,
        itemContext,
        getItemProps,
        getResizeProps
      }) {
      const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
      const color = idToHex(item.group)
      const groupName = idToGroupName(item.group) // TODO: Pass in group props better
      item.itemProps.primaryColor = color
      return (
        <div {...getItemProps(item.itemProps)}>
          
          <box-icon class="event_point_marker" name='radio-circle' color={color} ></box-icon>
          {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}
          <div
            className="rct-item-content"
            style={{ maxHeight: `${itemContext.dimensions.height}` }}
          >
            {itemContext.title}
          </div>
          {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
          
          {openModal == item.id ?
          <EventCard
            item={item} 
            groupName={groupName} 
            removeItemById={removeItemById} 
            replaceItem={replaceItem} 
            deselectItem={deselectItem}
            
          /> : ''}

          {/* {openModal == item.id ? <FloatingDescriptionBox item={item}/> : ''} */}
        </div>
        
      )
    }
    
    function addNewGroup() {
      const newGroupId = groups.length + 1
      const newGroup = {id: newGroupId, title: "Arc "+newGroupId}
      const blankGroups = {}
      console.log(newGroup)
      setGroups((prev) => [...prev, newGroup])
    }
    
    function createArrayWithIds(start, end){ // Creates blank groups
      return Array.from({ length: (end - start) + 1 }, (_, i) => ({
        id: start + i,
        title: ''
      }));
    };

    function groupWithPadding(paddingAmount){ // adds negative ID blankspace
      const beforePadding = createArrayWithIds(-paddingAmount, -1)
      const afterPadding = createArrayWithIds(-2*paddingAmount, -paddingAmount-1)
      return [...beforePadding, ... groups, ...afterPadding]
      // return [{id: -1, title: ''}, ... groups, ...afterPadding]
    }

    // useEffect(() => {
    //   console.log("openModal has changed:", openModal);
    // }, [openModal]);

    // JSX
    return (
       <div>
        <button className="add_arc_button" onClick={(ev) => { ev.preventDefault(); addNewGroup();}}>
              <box-icon class="text_icon_left" type='solid' name='train' color="white"></box-icon>
              <span>Create New Arc</span>
        </button>
        {/* <button className="add_arc_button" onClick={(ev) => { ev.preventDefault(); console.log("Import CSV");}}>
              <box-icon class="text_icon_left" name='import' color="white"></box-icon>
              <span>Import Timeline</span>
        </button> */}
        <i>Click on a line to add a event!</i>
        <Timeline
          groups={groupWithPadding(4)}
          items={items}
          defaultTimeStart={moment().add(-12, 'hour')}
          defaultTimeEnd={moment().add(12, 'hour')}
          onCanvasDoubleClick =  {createItem}
          onItemMove={moveItem}
          onItemSelect = {selectItem}
          onItemDeselect = {deselectItem}
          groupRenderer={({ group }) => {return <CustomGroupRenderer group = {group}/>}}
          itemRenderer={defaultItemRenderer}
          horizontalLineClassNamesForGroup={group => {return [idToColorClassName(group.id)]} } // colour based on id.
          lineHeight= '30'
        />


            <button className="refresh_tags_button" onClick={(ev) => { ev.preventDefault(); refreshTagList();}}>Refresh Tags</button>
        <h2>Tags</h2>
            {tagList.map((tag) => {
                return (
                    <div key={tag}>{tag}</div>
                )
            })}
      </div>
      )
}
