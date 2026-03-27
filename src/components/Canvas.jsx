import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import ReactFlow, {
  Background, Controls, MiniMap,
  addEdge, useNodesState, useEdgesState,
  Handle, Position, MarkerType,
  useReactFlow, ReactFlowProvider,
  Panel, EdgeLabelRenderer, BaseEdge, getStraightPath, getBezierPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import WaterNode from './waterTreatment/WaterNode';
import PipeEdge from './waterTreatment/PipeEdge';
import { WT_COMPONENTS } from './waterTreatment/WaterTreatmentData.jsx';

/* ═══════════════════════════════════════════════════════════
   COLOURS
═══════════════════════════════════════════════════════════ */
const COLORS = {
  blue:   { bg:'#1a4a7a', bd:'#3b82f6', hd:'#1e40af', fg:'#bfdbfe' },
  green:  { bg:'#14532d', bd:'#22c55e', hd:'#15803d', fg:'#bbf7d0' },
  purple: { bg:'#3b0764', bd:'#a855f7', hd:'#7c3aed', fg:'#e9d5ff' },
  amber:  { bg:'#78350f', bd:'#f59e0b', hd:'#b45309', fg:'#fde68a' },
  teal:   { bg:'#134e4a', bd:'#14b8a6', hd:'#0f766e', fg:'#99f6e4' },
  coral:  { bg:'#7f1d1d', bd:'#f87171', hd:'#b91c1c', fg:'#fecaca' },
  pink:   { bg:'#831843', bd:'#f472b6', hd:'#be185d', fg:'#fbcfe8' },
  red:    { bg:'#7f1d1d', bd:'#ef4444', hd:'#991b1b', fg:'#fca5a5' },
  gray:   { bg:'#1f2937', bd:'#6b7280', hd:'#374151', fg:'#d1d5db' },
};

const TYPE_COLOR = {
  digital_input:'blue',   digital_output:'blue',   analog_output:'blue',
  modbus_read:'gray',     modbus_write:'gray',      websocket_upstream:'gray',
  i2c_node:'gray',        spi_node:'gray',          uart_node:'gray',
  and:'purple',           or:'purple',              not:'purple',
  xor:'purple',           nand:'purple',            nor:'purple',
  xnor:'purple',          buffer:'purple',          tri_state:'purple',
  sr_latch:'pink',        d_flipflop:'pink',        jk_flipflop:'pink',
  t_flipflop:'pink',      set_reset:'pink',
  counter_up:'coral',     counter_down:'coral',     counter_updown:'coral',
  shift_register:'coral', ring_counter:'coral',
  timer_on:'teal',        timer_off:'teal',         timer_pulse:'teal',
  debounce:'teal',        watchdog_timer:'teal',    rtc_node:'teal',
  threshold:'amber',      pid_controller:'amber',   scale_map:'amber',
  moving_average:'amber', rate_of_change:'amber',   hysteresis:'amber',
  low_pass:'amber',       high_pass:'amber',
  add_node:'green',       subtract_node:'green',    multiply_node:'green',
  divide_node:'green',    abs_node:'green',         modulo_node:'green',
  comparator:'green',     mux_node:'green',         demux_node:'green',
  temp_sensor:'blue',     pressure_sensor:'blue',   flow_sensor:'blue',
  level_sensor:'blue',    current_sensor:'blue',    voltage_sensor:'blue',
  proximity_sensor:'blue',encoder:'blue',           adc_node:'blue',
  emergency_stop:'red',   overcurrent_prot:'red',   interlock:'red',
  overtemp_protection:'red', undervoltage_lockout:'red', fault_latch:'red',
  lcd_i2c:'amber',        seven_seg:'amber',        buzzer:'amber',
  rgb_led:'amber',        oled_display:'amber',
};

/* ═══════════════════════════════════════════════════════════
   NODE DEFINITIONS
═══════════════════════════════════════════════════════════ */
const NODE_DEFS = {
  digital_input:        { abbr:'DI',    label:'Digital Input',        fields:[{k:'pin',t:'number',v:4}] },
  digital_output:       { abbr:'DO',    label:'Digital Output',       fields:[{k:'pin',t:'number',v:17}] },
  analog_output:        { abbr:'AO',    label:'Analog Output',        fields:[{k:'pin',t:'number',v:1},{k:'range',t:'select',v:'0-10V',opts:'0-10V|4-20mA|0-5V'}] },
  modbus_read:          { abbr:'MBR',   label:'Modbus Read',          fields:[{k:'slave_id',t:'number',v:1},{k:'fn_code',t:'select',v:'03',opts:'01|02|03|04'},{k:'register',t:'number',v:0},{k:'data_type',t:'select',v:'Int16',opts:'Boolean|Int16|Uint16|Float32'},{k:'poll_rate',t:'number',v:1}] },
  modbus_write:         { abbr:'MBW',   label:'Modbus Write',         fields:[{k:'slave_id',t:'number',v:1},{k:'fn_code',t:'select',v:'06',opts:'05|06|16'},{k:'register',t:'number',v:0},{k:'trigger',t:'select',v:'On Change',opts:'On Change|Continuous'}] },
  websocket_upstream:   { abbr:'WSU',   label:'WebSocket Upstream',   fields:[{k:'url',t:'text',v:'ws://host/ws'},{k:'topic',t:'text',v:'sensor/data'},{k:'interval',t:'number',v:1}] },
  i2c_node:             { abbr:'I2C',   label:'I2C Node',             fields:[{k:'addr',t:'text',v:'0x48'},{k:'reg',t:'number',v:0}] },
  spi_node:             { abbr:'SPI',   label:'SPI Node',             fields:[{k:'cs_pin',t:'number',v:8},{k:'clk_hz',t:'number',v:1000000}] },
  uart_node:            { abbr:'UART',  label:'UART Node',            fields:[{k:'baud',t:'number',v:9600},{k:'parity',t:'select',v:'N',opts:'N|E|O'}] },
  and:                  { abbr:'AND',   label:'AND Gate',             fields:[] },
  or:                   { abbr:'OR',    label:'OR Gate',              fields:[] },
  not:                  { abbr:'NOT',   label:'NOT Gate',             fields:[] },
  xor:                  { abbr:'XOR',   label:'XOR Gate',             fields:[] },
  nand:                 { abbr:'NAND',  label:'NAND Gate',            fields:[] },
  nor:                  { abbr:'NOR',   label:'NOR Gate',             fields:[] },
  xnor:                 { abbr:'XNOR',  label:'XNOR Gate',            fields:[] },
  buffer:               { abbr:'BUF',   label:'Buffer',               fields:[] },
  tri_state:            { abbr:'TRI',   label:'Tri-State',            fields:[{k:'enable',t:'number',v:0}] },
  sr_latch:             { abbr:'SR',    label:'SR Latch',             fields:[] },
  d_flipflop:           { abbr:'D-FF',  label:'D Flip-Flop',          fields:[{k:'clk_pin',t:'number',v:0}] },
  jk_flipflop:          { abbr:'JK',    label:'JK Flip-Flop',         fields:[{k:'clk_pin',t:'number',v:0}] },
  t_flipflop:           { abbr:'T-FF',  label:'T Flip-Flop',          fields:[{k:'clk_pin',t:'number',v:0}] },
  set_reset:            { abbr:'S/R',   label:'Set / Reset',          fields:[] },
  counter_up:           { abbr:'CTU',   label:'Count Up',             fields:[{k:'preset',t:'number',v:10}] },
  counter_down:         { abbr:'CTD',   label:'Count Down',           fields:[{k:'preset',t:'number',v:10}] },
  counter_updown:       { abbr:'CTUD',  label:'Count Up/Down',        fields:[{k:'preset',t:'number',v:10}] },
  shift_register:       { abbr:'SHR',   label:'Shift Register',       fields:[{k:'bits',t:'number',v:8},{k:'clk_pin',t:'number',v:0}] },
  ring_counter:         { abbr:'RING',  label:'Ring Counter',         fields:[{k:'stages',t:'number',v:4}] },
  timer_on:             { abbr:'TON',   label:'Timer ON Delay',       fields:[{k:'delay',t:'number',v:1.0}] },
  timer_off:            { abbr:'TOF',   label:'Timer OFF Delay',      fields:[{k:'delay',t:'number',v:1.0}] },
  timer_pulse:          { abbr:'TP',    label:'Pulse Timer',          fields:[{k:'pulse_s',t:'number',v:0.5}] },
  debounce:             { abbr:'DEB',   label:'Debounce Filter',      fields:[{k:'delay',t:'number',v:0.1}] },
  watchdog_timer:       { abbr:'WDT',   label:'Watchdog Timer',       fields:[{k:'timeout',t:'number',v:5}] },
  rtc_node:             { abbr:'RTC',   label:'Real-Time Clock',      fields:[{k:'trigger',t:'text',v:'HH:MM'}] },
  threshold:            { abbr:'THR',   label:'Threshold',            fields:[{k:'op',t:'select',v:'>',opts:'>|<|>=|<=|==|!='},{k:'value',t:'number',v:50}] },
  pid_controller:       { abbr:'PID',   label:'PID Controller',       fields:[{k:'kp',t:'number',v:1},{k:'ki',t:'number',v:0.1},{k:'kd',t:'number',v:0.01},{k:'sp',t:'number',v:100}] },
  scale_map:            { abbr:'MAP',   label:'Scale Map',            fields:[{k:'in_min',t:'number',v:0},{k:'in_max',t:'number',v:1023},{k:'out_min',t:'number',v:0},{k:'out_max',t:'number',v:100}] },
  moving_average:       { abbr:'AVG',   label:'Moving Average',       fields:[{k:'window',t:'number',v:10}] },
  rate_of_change:       { abbr:'RoC',   label:'Rate of Change',       fields:[{k:'threshold',t:'number',v:5}] },
  hysteresis:           { abbr:'HYS',   label:'Hysteresis',           fields:[{k:'upper',t:'number',v:55},{k:'lower',t:'number',v:45}] },
  low_pass:             { abbr:'LPF',   label:'Low-Pass Filter',      fields:[{k:'cutoff_hz',t:'number',v:10}] },
  high_pass:            { abbr:'HPF',   label:'High-Pass Filter',     fields:[{k:'cutoff_hz',t:'number',v:10}] },
  add_node:             { abbr:'ADD',   label:'Add',                  fields:[] },
  subtract_node:        { abbr:'SUB',   label:'Subtract',             fields:[] },
  multiply_node:        { abbr:'MUL',   label:'Multiply',             fields:[] },
  divide_node:          { abbr:'DIV',   label:'Divide',               fields:[] },
  abs_node:             { abbr:'ABS',   label:'Absolute Value',       fields:[] },
  modulo_node:          { abbr:'MOD',   label:'Modulo',               fields:[{k:'divisor',t:'number',v:10}] },
  comparator:           { abbr:'CMP',   label:'Comparator',           fields:[{k:'op',t:'select',v:'>',opts:'>|<|>=|<=|==|!='}] },
  mux_node:             { abbr:'MUX',   label:'Multiplexer',          fields:[{k:'select',t:'number',v:0}] },
  demux_node:           { abbr:'DEMUX', label:'Demultiplexer',        fields:[{k:'select',t:'number',v:0}] },
  temp_sensor:          { abbr:'TMP',   label:'Temperature',          fields:[{k:'type',t:'select',v:'DS18B20',opts:'DS18B20|PT100|NTC|DHT22'},{k:'pin',t:'number',v:4}] },
  pressure_sensor:      { abbr:'PRS',   label:'Pressure',             fields:[{k:'pin',t:'number',v:0},{k:'range',t:'text',v:'0-10bar'}] },
  flow_sensor:          { abbr:'FLW',   label:'Flow',                 fields:[{k:'pin',t:'number',v:5},{k:'ppl',t:'number',v:450}] },
  level_sensor:         { abbr:'LVL',   label:'Level',                fields:[{k:'type',t:'select',v:'ultrasonic',opts:'ultrasonic|float|capacitive'},{k:'pin',t:'number',v:6}] },
  current_sensor:       { abbr:'CUR',   label:'Current (CT)',         fields:[{k:'pin',t:'number',v:1},{k:'ct_ratio',t:'number',v:100}] },
  voltage_sensor:       { abbr:'VLT',   label:'Voltage',              fields:[{k:'pin',t:'number',v:2},{k:'divider',t:'number',v:11}] },
  proximity_sensor:     { abbr:'PRX',   label:'Proximity',            fields:[{k:'type',t:'select',v:'ultrasonic',opts:'ultrasonic|inductive|capacitive'},{k:'pin',t:'number',v:7}] },
  encoder:              { abbr:'ENC',   label:'Encoder',              fields:[{k:'a_pin',t:'number',v:8},{k:'b_pin',t:'number',v:9},{k:'ppr',t:'number',v:600}] },
  adc_node:             { abbr:'ADC',   label:'ADC (ADS1115)',        fields:[{k:'addr',t:'text',v:'0x48'},{k:'ch',t:'number',v:0},{k:'gain',t:'number',v:1}] },
  emergency_stop:       { abbr:'ESTOP', label:'Emergency Stop',       fields:[{k:'pin',t:'number',v:2},{k:'nc',t:'select',v:'true',opts:'true|false'}] },
  overcurrent_prot:     { abbr:'OCP',   label:'Overcurrent Prot.',    fields:[{k:'trip_a',t:'number',v:10},{k:'delay_ms',t:'number',v:100}] },
  interlock:            { abbr:'ILK',   label:'Interlock',            fields:[] },
  overtemp_protection:  { abbr:'OTP',   label:'Overtemp Prot.',       fields:[{k:'trip_c',t:'number',v:85}] },
  undervoltage_lockout: { abbr:'UVLO',  label:'Undervoltage Lockout', fields:[{k:'threshold',t:'number',v:10.5}] },
  fault_latch:          { abbr:'FLT',   label:'Fault Latch',          fields:[] },
  lcd_i2c:              { abbr:'LCD',   label:'LCD (I2C)',             fields:[{k:'addr',t:'text',v:'0x27'},{k:'msg',t:'text',v:'Hello'}] },
  seven_seg:            { abbr:'7SEG',  label:'7-Segment',            fields:[{k:'clk',t:'number',v:11},{k:'dio',t:'number',v:12}] },
  buzzer:               { abbr:'BUZ',   label:'Buzzer',               fields:[{k:'pin',t:'number',v:13},{k:'freq',t:'number',v:1000},{k:'dur_ms',t:'number',v:200}] },
  rgb_led:              { abbr:'RGB',   label:'RGB LED',              fields:[{k:'r_pin',t:'number',v:14},{k:'g_pin',t:'number',v:15},{k:'b_pin',t:'number',v:16}] },
  oled_display:         { abbr:'OLED',  label:'OLED Display',         fields:[{k:'addr',t:'text',v:'0x3C'}] },
};

/* ═══════════════════════════════════════════════════════════
   PLCNode — MODULE LEVEL (stable reference)
═══════════════════════════════════════════════════════════ */
function PLCNode({ data, selected }) {
  const { nodeType } = data;
  const def      = NODE_DEFS[nodeType] ?? { abbr:'?', label: nodeType, fields:[] };
  const colorKey = TYPE_COLOR[nodeType] ?? 'gray';
  const c        = COLORS[colorKey];

  const [vals, setVals] = useState(() => {
    const init = {};
    def.fields.forEach(f => { init[f.k] = data.initVals?.[f.k] ?? f.v; });
    return init;
  });

  /* keep parent's onValChange in sync so JSON export always has latest values */
  useEffect(() => {
    data.onValChange?.(vals);
  }, [vals]);

  const stop = e => { e.stopPropagation(); e.nativeEvent?.stopImmediatePropagation?.(); };

  const handleStyle = {
    width: '0.75rem', height: '0.75rem',
    background: c.bd, border: `0.125rem solid ${c.bg}`,
    borderRadius: '50%', top: '50%', transform: 'translateY(-50%)',
    zIndex: 10, cursor: 'crosshair',
  };

  return (
    <div style={{
      width: '14rem', minWidth: '10rem',
      borderRadius: '0.5rem',
      border: `2px solid ${selected ? '#60a5fa' : c.bd}`,
      overflow: 'visible',
      boxShadow: selected
        ? '0 0 0 3px rgba(96,165,250,0.35), 0 0.25rem 1.25rem rgba(0,0,0,0.5)'
        : '0 0.2rem 0.75rem rgba(0,0,0,0.4)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      background: c.bg,
    }}>
      {/* LEFT handle — hidden for source-only nodes (digital_input, analog_output) */}
      {nodeType !== 'digital_input' && nodeType !== 'analog_output' && (
        <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: '-0.4rem' }} />
      )}

      {/* HEADER */}
      <div style={{
        background: c.hd, padding: '0.5rem 0.7rem',
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        borderRadius: '0.45rem 0.45rem 0 0', overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: 'monospace', fontSize: '0.55rem', fontWeight: 700,
          letterSpacing: '0.07em', background: 'rgba(255,255,255,0.2)',
          color: '#fff', padding: '0.1rem 0.35rem', borderRadius: '0.2rem',
          flexShrink: 0, whiteSpace: 'nowrap',
        }}>{def.abbr}</span>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600, color: '#fff', lineHeight: 1.25,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{def.label}</span>
      </div>

      {/* FIELDS */}
      {def.fields.length > 0 && (
        <div style={{
          padding: '0.55rem 0.7rem 0.65rem',
          display: 'flex', flexDirection: 'column', gap: '0.45rem',
          background: c.bg, borderRadius: '0 0 0.45rem 0.45rem', overflow: 'hidden',
        }}>
          {def.fields.map(f => (
            <div key={f.k} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
              <span style={{
                fontSize: '0.6rem', color: c.fg, width: '3rem', minWidth: '3rem',
                textAlign: 'right', fontFamily: 'monospace', userSelect: 'none',
                opacity: 0.8, flexShrink: 0, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{f.k}</span>

              {f.t === 'select' ? (
                <select
                  value={vals[f.k]}
                  onChange={e => setVals(p => ({ ...p, [f.k]: e.target.value }))}
                  onMouseDown={stop} onClick={stop} onPointerDown={stop}
                  style={{
                    flex: 1, minWidth: 0, height: '1.75rem',
                    background: 'rgba(255,255,255,0.13)', border: `1px solid ${c.bd}`,
                    borderRadius: '0.3rem', padding: '0 0.35rem',
                    fontSize: '0.7rem', fontWeight: 600, color: '#fff',
                    cursor: 'pointer', outline: 'none', appearance: 'auto',
                    boxSizing: 'border-box', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {(f.opts ?? '').split('|').map(o => (
                    <option key={o} value={o} style={{ background: c.hd }}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.t === 'number' ? 'number' : 'text'}
                  value={vals[f.k]}
                  step={f.t === 'number' ? 'any' : undefined}
                  onChange={e => setVals(p => ({
                    ...p,
                    [f.k]: f.t === 'number'
                      ? (e.target.value === '' ? '' : parseFloat(e.target.value))
                      : e.target.value,
                  }))}
                  onMouseDown={stop} onClick={stop} onPointerDown={stop} onKeyDown={stop}
                  style={{
                    flex: 1, minWidth: 0, height: '2rem',
                    background: 'rgba(255,255,255,0.11)', border: `1px solid ${c.bd}`,
                    borderRadius: '0.3rem', padding: '0 0.6rem',
                    fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                    outline: 'none', boxSizing: 'border-box', margin: 0,
                    WebkitAppearance: 'none', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* RIGHT handle — hidden for sink-only nodes (digital_output) */}
      {nodeType !== 'digital_output' && (
        <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: '-0.4rem' }} />
      )}
    </div>
  );
}

const nodeTypes = { plcNode: PLCNode, waterNode: WaterNode };

/* ═══════════════════════════════════════════════════════════
   CUSTOM EDGE — with × delete button at midpoint
═══════════════════════════════════════════════════════════ */
function DeletableEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style = {}, markerEnd, data,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const onDelete = (e) => {
    e.stopPropagation();
    data?.onDelete?.(id);
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          <button
            onClick={onDelete}
            title="Delete connection"
            style={{
              width: '1.25rem',
              height: '1.25rem',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #fff',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
              transition: 'transform 0.12s, background 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)';   e.currentTarget.style.background = '#ef4444'; }}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const edgeTypes = { deletable: DeletableEdge, pipeEdge: PipeEdge };

/* ═══════════════════════════════════════════════════════════
   JSON POPUP
═══════════════════════════════════════════════════════════ */
function JsonPopup({ nodes, edges, onClose, isDark }) {
  /* build structured JSON: each node has its own object with data + connections */
  const json = {
    nodes: nodes.map(n => {
      const def = NODE_DEFS[n.data.nodeType] ?? { fields: [] };
      const fieldData = {};
      def.fields.forEach(f => {
        fieldData[f.k] = n.data.currentVals?.[f.k] ?? f.v;
      });
      return {
        id:   n.id,
        type: n.data.nodeType,
        data: fieldData,
      };
    }),
    edges: edges.map(e => ({
      source: e.source,
      target: e.target,
    })),
  };

  const text = JSON.stringify(json, null, 2);

  const overlay = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  };
  const box = {
    width: 'min(640px, 90vw)',
    maxHeight: '80vh',
    background: isDark ? '#0f172a' : '#ffffff',
    border: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
    borderRadius: '0.75rem',
    display: 'flex', flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    overflow: 'hidden',
  };
  const header = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.85rem 1.1rem',
    borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
    background: isDark ? '#0f172a' : '#f8fafc',
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={e => e.stopPropagation()}>
        {/* header */}
        <div style={header}>
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isDark ? '#e2e8f0' : '#1e293b' }}>
            Flow JSON
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => navigator.clipboard?.writeText(text)}
              style={{
                background: isDark ? '#1e293b' : '#e2e8f0',
                border: 'none', borderRadius: '0.35rem',
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem', fontWeight: 600,
                color: isDark ? '#94a3b8' : '#475569',
                cursor: 'pointer',
              }}
            >Copy</button>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none',
                fontSize: '1.3rem', lineHeight: 1,
                color: isDark ? '#64748b' : '#94a3b8',
                cursor: 'pointer', padding: '0 0.2rem',
                display: 'flex', alignItems: 'center',
              }}
            >×</button>
          </div>
        </div>
        {/* JSON body */}
        <pre style={{
          flex: 1, overflowY: 'auto',
          margin: 0, padding: '1rem 1.1rem',
          fontSize: '0.75rem', lineHeight: 1.7,
          fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
          color: isDark ? '#a5f3fc' : '#0f172a',
          background: isDark ? '#0f172a' : '#f8fafc',
          whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}>
          {text}
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DROP ZONE
═══════════════════════════════════════════════════════════ */
function DropZone({ children }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' });
  return (
    <div ref={setNodeRef} id="canvas-drop-zone"
      style={{
        width: '100%', height: '100%', position: 'relative',
        outline: isOver ? '2px dashed #3b82f6' : '2px dashed transparent',
        outlineOffset: -3, transition: 'outline 0.1s',
      }}
    >{children}</div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INNER CANVAS
═══════════════════════════════════════════════════════════ */
function InnerCanvas({ theme, droppedNodes, activeConnectionType, onClear }) {
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState([]);
  const [showJson, setShowJson] = useState(false);
  const processedIds = useRef(new Set());
  const { screenToFlowPosition } = useReactFlow();

  /* stable callback so each node can report its current field values */
  const makeValChange = useCallback((nodeId) => (vals) => {
    setRfNodes(prev => prev.map(n =>
      n.id === nodeId
        ? { ...n, data: { ...n.data, currentVals: vals } }
        : n
    ));
  }, []);

  useEffect(() => {
    const fresh = droppedNodes.filter(n => !processedIds.current.has(n.id));
    if (!fresh.length) return;
    fresh.forEach(n => processedIds.current.add(n.id));

    const rfNew = fresh.map(n => {
      const pos = screenToFlowPosition({ x: n.screenX, y: n.screenY });

      /* ── Water Treatment node ── */
      if (n.isWaterTreatment) {
        return {
          id: n.id,
          type: 'waterNode',
          position: pos,
          data: { nodeType: n.nodeType },
        };
      }

      /* ── PLC node (existing) ── */
      const def = NODE_DEFS[n.nodeType] ?? { fields: [] };
      const currentVals = {};
      def.fields.forEach(f => { currentVals[f.k] = n.initVals?.[f.k] ?? f.v; });

      return {
        id: n.id,
        type: 'plcNode',
        position: pos,
        data: {
          nodeType:    n.nodeType,
          hasIn:       n.hasIn,
          hasOut:      n.hasOut,
          initVals:    n.initVals ?? {},
          currentVals,
          onValChange: makeValChange(n.id),
        },
      };
    });

    setRfNodes(prev => [...prev, ...rfNew]);
  }, [droppedNodes, screenToFlowPosition, makeValChange]);

  const onDeleteEdge = useCallback((edgeId) => {
    setRfEdges(prev => prev.filter(e => e.id !== edgeId));
  }, []);

  const onConnect = useCallback(params => {
    /* Check if either source or target is a water treatment node */
    const sourceNode = rfNodes.find(n => n.id === params.source);
    const targetNode = rfNodes.find(n => n.id === params.target);
    const isWTConnection = sourceNode?.type === 'waterNode' || targetNode?.type === 'waterNode';

    const newEdge = isWTConnection
      ? {
          ...params,
          type: 'pipeEdge',
          data: {
            connectionType: activeConnectionType || 'water_pipe',
            onDelete: onDeleteEdge,
          },
        }
      : {
          ...params,
          type: 'deletable',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          style: { strokeWidth: 2, stroke: '#94a3b8' },
        };

    setRfEdges(e => addEdge(newEdge, e).map(ed =>
      ed.id === newEdge.id || (ed.source === newEdge.source && ed.target === newEdge.target)
        ? { ...ed, data: { ...ed.data, onDelete: onDeleteEdge } }
        : ed
    ));
  }, [onDeleteEdge, rfNodes, activeConnectionType]);

  const isDark = theme === 'dark';

  /* ── theme-aware colours ── */
  const bgCol      = isDark ? '#111827' : '#f1f5f9';
  /* Task 1: higher opacity dots */
  const dotCol     = isDark ? '#334155' : '#94a3b8';   /* was #1f2937 / #cbd5e1 */
  const dotOpacity = isDark ? 0.9 : 0.7;               /* explicit opacity boost */

  /* Task 2: minimap & controls theme */
  const mapBg      = isDark ? '#1e293b' : '#1e293b';   /* dark in light, same dark */
  const mapBorder  = isDark ? '#334155' : '#0f172a';
  const mapMask    = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(15,23,42,0.5)';
  const ctrlBg     = isDark ? '#1e293b' : '#1e293b';   /* dark buttons in light mode */
  const ctrlColor  = isDark ? '#e2e8f0' : '#f1f5f9';
  const ctrlBorder = isDark ? '#334155' : '#0f172a';

  return (
    <>
      <ReactFlow
        nodes={rfNodes} edges={rfEdges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView fitViewOptions={{ padding: 0.4, maxZoom: 1.2 }}
        deleteKeyCode="Delete"
        minZoom={0.15} maxZoom={2.5}
        style={{ background: bgCol }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Task 1: higher opacity dots */}
        <Background
          variant="dots"
          gap={20} size={1.5}
          color={dotCol}
          style={{ opacity: dotOpacity }}
        />

        {/* Task 2: controls dark in both themes */}
        <Controls showInteractive={false} style={{
          button: {
            background: ctrlBg,
            color: ctrlColor,
            border: `1px solid ${ctrlBorder}`,
          }
        }} />

        {/* Task 2: minimap dark in both themes */}
        <MiniMap
          nodeColor={n => COLORS[TYPE_COLOR[n.data?.nodeType] ?? 'gray']?.bd ?? '#888'}
          maskColor={mapMask}
          style={{
            background: mapBg,
            border: `1px solid ${mapBorder}`,
            borderRadius: 6,
          }}
        />

        <Panel position="top-right">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {/* Clear button */}
            <button
              onClick={() => {
                setRfNodes([]);
                setRfEdges([]);
                processedIds.current = new Set();
                onClear?.();
              }}
              style={{
                background: '#374151',
                color: '#e5e7eb',
                border: '1px solid #4b5563',
                borderRadius: '0.45rem',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#374151'; e.currentTarget.style.borderColor = '#4b5563'; e.currentTarget.style.color = '#e5e7eb'; }}
            >
              Clear
            </button>
            {/* Get JSON button */}
            <button
              onClick={() => setShowJson(true)}
              style={{
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '0.45rem',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
                transition: 'background 0.15s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#2563eb'; }}
            >
              Get JSON
            </button>
          </div>
        </Panel>

        {/* empty-state hint */}
        {rfNodes.length === 0 && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none', textAlign: 'center', zIndex: 5,
          }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
              stroke={isDark ? '#334155' : '#94a3b8'} strokeWidth="1"
              style={{ display: 'block', margin: '0 auto 12px' }}>
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <path d="M17.5 14v6M14.5 17h6" strokeLinecap="round"/>
            </svg>
            <p style={{ color: isDark ? '#475569' : '#94a3b8', fontSize: 13, margin: 0, fontWeight: 500 }}>
              Open the Low Code panel
            </p>
            <p style={{ color: isDark ? '#334155' : '#cbd5e1', fontSize: 11, marginTop: 4 }}>
              drag nodes onto the canvas to begin
            </p>
          </div>
        )}
      </ReactFlow>

      {/* Task 4: JSON popup rendered outside ReactFlow so it sits above everything */}
      {showJson && (
        <JsonPopup
          nodes={rfNodes}
          edges={rfEdges}
          onClose={() => setShowJson(false)}
          isDark={isDark}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORTED CANVAS
═══════════════════════════════════════════════════════════ */
const Canvas = ({ theme, droppedNodes, activeConnectionType, onClear }) => (
  <DropZone>
    <ReactFlowProvider>
      <InnerCanvas theme={theme} droppedNodes={droppedNodes} activeConnectionType={activeConnectionType} onClear={onClear} />
    </ReactFlowProvider>
  </DropZone>
);

export default Canvas;
