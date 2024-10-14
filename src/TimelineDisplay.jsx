import Timeline from 'react-calendar-timeline'
import 'react-calendar-timeline/lib/Timeline.css'
import moment from 'moment'
import { useState } from 'react'
import "./TimelineDisplay.css";
import 'boxicons' // icons 
import FloatingDescriptionBox from './FloatingDescriptionBox.jsx';

export default function TimelineDisplay({initialItems, initialGroups}) { 
    const [openModal, setOpenModal]= useState(null) // ItemID for open Description Boxes
    const [groups, setGroups] = useState(initialGroups) // Groups/Arcs
    const [items, setItems] = useState(initialItems) // 
    const [nextOpenId, setNextOpenId] = useState(items.length+1) // 
    const [tagList, setTagList] = useState([]) // 
    
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
          longDescription: "This is a long item description",
          tags: ["CharacterA", "SettingB", "Action"]
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
     * 
     * @param {Int16Array} id 
     * @returns Item reference or undefined
     */
    function getItemById(id) {
      return items.filter(item => item.id === id).pop();
    }

    function selectItem(itemId, e, time) { // spawn a Description box
      setOpenModal(itemId)
    }

    function deselectItem(e) { //Delete all Description boxes when deselected
      setOpenModal(null)
    }
    // Requires GroupColours
    function idToColorClassName(_group_id){ 
      return group_colors[_group_id%group_colors.length]
    }
    function idToHex(_group_id){ 
      return hex_colors[_group_id%hex_colors.length]
    }

    /**
     * 
     * @param {Group Object} param0 
     * @returns JSX object containing that group's component to be rendered. 
     */
    function CustomGroupRenderer ({ group }){
      return (
        <div style={{ position: 'relative' }}>
          {/* Background line behind the group */}
          <div
            class="subwayline"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '20%',
              backgroundColor: group.color, // Custom color for each group
              zIndex: -1,
              opacity: 1, // Adjust opacity to make it less intense
            }}
          />
          {/* Group label */}
          <span>{group.title}</span>
        </div>
      );
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

          {openModal == item.id ? <FloatingDescriptionBox item={item}/> : ''}
        </div>
        
      )
    }
    
    function addNewGroup() {
      const newGroupId = groups.length + 1
      const newGroup = {id: newGroupId, title: "Arc "+newGroupId}
      setGroups((prev) => [...prev, newGroup])
    }

    // JSX
    return (
       <div>
        <Timeline
          groups={groups}
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
        />
        <form>
            <button onClick={(ev) => { ev.preventDefault(); addNewGroup();}}>Add Arc</button>
        </form>
        <form>
            <button onClick={(ev) => { ev.preventDefault(); refreshTagList();}}>Refresh Tags</button>
        </form>
        <h2>Tags</h2>
            {tagList.map((tag) => {
                return (
                    <div key={tag}>{tag}</div>
                )
            })}
      </div>
      )
}
