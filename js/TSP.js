/**
 * TSP.js
 */

'use strict'

import wait from '../libs/wait'
import shuffle from '../libs/shuffle'
import GA from './GA'

export default class TSP {
  constructor (el, width, height, onstart, onstop) {
    this.el = el
    this.width = width
    this.height = height
    this.nodes = []
    this.orders = []
    this.r = 4
    this.lw = 2

    this.mutation_rate = 0.05

    this.dr = window.devicePixelRatio || 1

    this.el
      .attr('width', width * this.dr)
      .attr('height', height * this.dr)
      .css({width: Math.min(width, screen.width) + 'px'})

    this.ctx = this.el[0].getContext('2d')
    this.is_running = false

    this._onstart = onstart
    this._onstop = onstop
  }

  makeRandomNodes (n = 32, life_count = 100) {
    this.is_running = false
    this.n = n
    this.life_count = life_count
    this.nodes = []
    this.orders = []

    let padding = 20

    for (let i = 0; i < n; i++) {
      this.nodes.push({
        x: Math.floor(Math.random() * (this.width - padding * 2)) + padding,
        y: Math.floor(Math.random() * (this.height - padding * 2)) + padding
      })
      this.orders.push(i)
    }

    shuffle(this.orders)
    this.orders.push(this.orders[0])
  }

  
  getDistance (order = null) {
    let d = 0
    let {nodes} = this
    order.concat(order[0]).reduce((a, b) => {
      d += Math.sqrt(Math.pow(nodes[a].x - nodes[b].x, 2) + Math.pow(nodes[a].y - nodes[b].y, 2))
      //d += Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)
      return b
    })
    return d
  }

  render () {
    let {ctx, r, nodes, dr} = this
    // ctx.clearRect(0, 0, this.width * dr, this.height * dr)

    ctx.lineWidth = this.lw * dr
    ctx.strokeStyle = 'rgba(64, 64, 64, 0.2)'

    // lines
    this.orders.concat(this.orders[0]).reduce((a, b) => {
      //console.log(a, '->', b)
      let na = nodes[a]
      let nb = nodes[b]
      ctx.beginPath()
      ctx.moveTo(na.x * dr, na.y * dr)
      ctx.lineTo(nb.x * dr, nb.y * dr)
      ctx.stroke()
      ctx.closePath()
      return b
    })

    ctx.lineWidth = 1 * dr
    ctx.strokeStyle = '#900'
    ctx.fillStyle = '#f66'
    // nodes
    nodes.map(n => {
      ctx.beginPath()
      ctx.arc(n.x * dr, n.y * dr, r * dr, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    })
    $('#gen').html(this.ga.generation)
    //$('#mutation').html(this.ga.mutation_count)
  }


}
