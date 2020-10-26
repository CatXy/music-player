import React, { Component } from 'react';
import './Player.less'
import pre from './img/pre.png'
import stop from  './img/stop.png'
import next from './img/next.png'
import play from './img/play.png'

import music1 from './file/1.mp3'
import music2 from  './file/2.mp3'
import music3 from './file/3.mp3'
import music4 from './file/4.mp3'


import img1 from './img/1.jpg'
import img2 from './img/2.jpg'
import img3 from './img/3.jpg'
import img4 from './img/4.jpg'

import AudioSpectrum from 'react-audio-spectrum'

const musicList = [
    {
        id:1,
        singer:"Jam",
        title:"梦里梦外",
        img:img1,
        url:music1
    },
    {
        id:2,
        singer:"前冲",
        title:"民谣在路上",
        img:img2,
        url:music2
    },
    {
        id:3,
        singer:"Jam",
        title:"南",
        img:img3,
        url:music3
    },
    {
        id:4,
        singer:"马雨贤",
        title:"我在济南等你",
        img:img4,
        url:music4
    }
]

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying:false,
            currentMusic:{},
            currentTime:"00:00",
            allTime:"00:00"

         }
    }
    componentDidMount(){
        this.setState({
            currentMusic:musicList[0],
        })
    }
    playMusic=()=>{
            this.setState({isPlaying: !this.state.isPlaying
            },()=>{
                    if (this.state.isPlaying){
                        this.refs.audioRef.play()
                    }else{
                        this.refs.audioRef.pause()
                    }
                })   
    }
    preMusic=()=>{
        let index = 0 ;
        musicList.forEach((item,i)=>{
            if(item.id === this.state.currentMusic.id){
                index = i
            }
        })
        if(index === 0){
            index = musicList.length 
        }
        this.setState({
            currentMusic:musicList[index - 1]
        },()=>{
           this.onSwitchActive()
        })

    }
    nextMusic=()=>{
        let index = 0 ;
        musicList.forEach((item,i)=>{
            if(item.id === this.state.currentMusic.id){
                index = i
            }
        })
        if(index === musicList.length - 1){
            index = -1
        }
        this.setState({
            currentMusic:musicList[index+1]
        },()=>{
           this.onSwitchActive()
        })
    }
    onSwitchActive = () => {
        const{isPlaying} = this.state
        if(isPlaying){
            this.refs.audioRef.play()
        }
    }
    timeAdapter(time){
        if(time){
        let min=Math.floor(time/60) < 10 ?"0"+Math.floor(time/60) : Math.floor(time/60)
        let second=Math.floor(time%60) < 10 ?"0"+Math.floor(time%60) : Math.floor(time%60)
        return min +":"+second
        }
        return "00:00"
    }
    onTimeUpdate=()=>{
        let allTime = this.timeAdapter(Number(this.refs.audioRef.duration))
        let currentTime = this.timeAdapter(Number(this.refs.audioRef.currentTime))
        this.setState({
            allTime,
            currentTime
        })
        if(this.refs.audioRef.ended){
            this.nextMusic()
        }
        let w  =this.refs.bar.offsetWidth - this.refs.pass.offsetWidth
        let currentWidth = w * (this.refs.audioRef.currentTime/this.refs.audioRef.duration)
        this.refs.pass.style.width = currentWidth +"px"
        this.refs.cricle.style.transform="translateX("+ currentWidth +"px)"

    }
    handleChange=(data)=>{
        const{isPlaying} = this.state;
        if(data == this.state.currentMusic && isPlaying) {
            this.setState({
                isPlaying:true
            })
            return;
        }
        this.setState({
            currentMusic:data
        },()=>{
            this.onSwitchActive();
        })
    }

    render() { 
        const { isPlaying,currentMusic} = this.state
        return ( 
            <div className="contianer">
                <audio src={currentMusic.url} ref={"audioRef"} id="audio-element" 
                onTimeUpdate={this.onTimeUpdate}
                />
                <div className="sing">
                    <div className="operation">
                        <div className="cover">
                            <img src={currentMusic.img} />
                        </div>
                        <div className="buttons">
                            <img src={pre} onClick={this.preMusic}/>
                            <img src={isPlaying ? play : stop} alt="" 
                            onClick={this.playMusic}
                            />
                            <img src={next} onClick={this.nextMusic} />
                        </div>
                        <div className="programBar" ref={"bar"}>
                            <div className="programPass" ref={"pass"}></div>
                            <div className="cricle" ref={"cricle"}></div>
                        </div>
                        <div className="time">
                            {this.state.currentTime}/{this.state.allTime}
                        </div>
                    </div>
                    <div className="list">
                        {
                                musicList.map(item=>(
                                <div className={item.id===currentMusic.id?"active":""} key={item.id} onClick={()=>this.handleChange(item)}>{item.singer} - {item.title}</div>
                            ))
                        }
                    </div>
                </div>
                <div className="dance">      
                        <AudioSpectrum
                        id="audio-canvas"
                        height={300}
                        width={400}
                        audioId={'audio-element'}
                        capColor={'white'}
                        capHeight={3}
                        meterWidth={3}
                        meterCount={512}
                        meterColor={[
                        {stop: 0, color: '#f00'},
                        {stop: 0.5, color: '#0CD7FD'},
                        {stop: 1, color: 'lightblue'}
                        ]}
                        gap={4}/>
                    </div>
            </div>
         );
    }
}
 
export default Player;