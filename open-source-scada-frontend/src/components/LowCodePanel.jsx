import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { X, ChevronRight } from 'lucide-react';

// ─── Full node palette definition ───────────────────────────────────────────
const COLORS = {
  blue:   { bg:'#E6F1FB', bd:'#B5D4F4', tx:'#0C447C', hd:'#185FA5' },
  green:  { bg:'#EAF3DE', bd:'#C0DD97', tx:'#27500A', hd:'#3B6D11' },
  purple: { bg:'#EEEDFE', bd:'#CECBF6', tx:'#3C3489', hd:'#534AB7' },
  amber:  { bg:'#FAEEDA', bd:'#FAC775', tx:'#633806', hd:'#854F0B' },
  teal:   { bg:'#E1F5EE', bd:'#9FE1CB', tx:'#085041', hd:'#0F6E56' },
  coral:  { bg:'#FAECE7', bd:'#F5C4B3', tx:'#712B13', hd:'#993C1D' },
  pink:   { bg:'#FBEAF0', bd:'#F4C0D1', tx:'#72243E', hd:'#993556' },
  red:    { bg:'#FCEBEB', bd:'#F7C1C1', tx:'#791F1F', hd:'#A32D2D' },
  gray:   { bg:'#F1EFE8', bd:'#D3D1C7', tx:'#444441', hd:'#5F5E5A' },
};

const PALETTE = [
  { section: 'Hardware I/O', colorKey: 'blue', nodes: [
    { type:'digital_input',  abbr:'DI',  label:'Digital Input',  fields:[{k:'pin',t:'number',v:4}],  hasIn:false, hasOut:true },
    { type:'digital_output', abbr:'DO',  label:'Digital Output', fields:[{k:'pin',t:'number',v:17}], hasIn:true,  hasOut:false },
    { type:'analog_output',  abbr:'AO',  label:'Analog Output',  fields:[{k:'pin',t:'number',v:1},{k:'range',t:'select',v:'0-10V',opts:'0-10V|4-20mA|0-5V'}], hasIn:true, hasOut:false },
  ]},
  { section: 'Communication', colorKey: 'gray', nodes: [
    { type:'modbus_read',  abbr:'MBR',  label:'Modbus Read',
      fields:[{k:'slave_id',t:'number',v:1},{k:'fn_code',t:'select',v:'03',opts:'01|02|03|04'},{k:'register',t:'number',v:0},{k:'data_type',t:'select',v:'Int16',opts:'Boolean|Int16|Uint16|Float32'},{k:'poll_rate',t:'number',v:1}],
      hasIn:false, hasOut:true },
    { type:'modbus_write', abbr:'MBW',  label:'Modbus Write',
      fields:[{k:'slave_id',t:'number',v:1},{k:'fn_code',t:'select',v:'06',opts:'05|06|16'},{k:'register',t:'number',v:0},{k:'trigger',t:'select',v:'On Change',opts:'On Change|Continuous'}],
      hasIn:true, hasOut:false },
    { type:'websocket_upstream', abbr:'WSU', label:'WebSocket Upstream',
      fields:[{k:'url',t:'text',v:'ws://host/ws'},{k:'topic',t:'text',v:'sensor/data'},{k:'interval',t:'number',v:1}],
      hasIn:true, hasOut:false },
    { type:'i2c_node',  abbr:'I2C',  label:'I2C Node',  fields:[{k:'addr',t:'text',v:'0x48'},{k:'reg',t:'number',v:0}], hasIn:true, hasOut:true },
    { type:'spi_node',  abbr:'SPI',  label:'SPI Node',  fields:[{k:'cs_pin',t:'number',v:8},{k:'clk_hz',t:'number',v:1000000}], hasIn:true, hasOut:true },
    { type:'uart_node', abbr:'UART', label:'UART Node', fields:[{k:'baud',t:'number',v:9600},{k:'parity',t:'select',v:'N',opts:'N|E|O'}], hasIn:true, hasOut:true },
  ]},
  { section: 'Logic Gates', colorKey: 'purple', nodes: [
    { type:'and',      abbr:'AND',  label:'AND Gate',   fields:[], hasIn:true, hasOut:true },
    { type:'or',       abbr:'OR',   label:'OR Gate',    fields:[], hasIn:true, hasOut:true },
    { type:'not',      abbr:'NOT',  label:'NOT Gate',   fields:[], hasIn:true, hasOut:true },
    { type:'xor',      abbr:'XOR',  label:'XOR Gate',   fields:[], hasIn:true, hasOut:true },
    { type:'nand',     abbr:'NAND', label:'NAND Gate',  fields:[], hasIn:true, hasOut:true },
    { type:'nor',      abbr:'NOR',  label:'NOR Gate',   fields:[], hasIn:true, hasOut:true },
    { type:'xnor',     abbr:'XNOR', label:'XNOR Gate',  fields:[], hasIn:true, hasOut:true },
    { type:'buffer',   abbr:'BUF',  label:'Buffer',     fields:[], hasIn:true, hasOut:true },
    { type:'tri_state',abbr:'TRI',  label:'Tri-State',  fields:[{k:'enable',t:'number',v:0}], hasIn:true, hasOut:true },
  ]},
  { section: 'Flip-Flops & Latches', colorKey: 'pink', nodes: [
    { type:'sr_latch',    abbr:'SR',   label:'SR Latch',     fields:[], hasIn:true, hasOut:true },
    { type:'d_flipflop',  abbr:'D-FF', label:'D Flip-Flop',  fields:[{k:'clk_pin',t:'number',v:0}], hasIn:true, hasOut:true },
    { type:'jk_flipflop', abbr:'JK',   label:'JK Flip-Flop', fields:[{k:'clk_pin',t:'number',v:0}], hasIn:true, hasOut:true },
    { type:'t_flipflop',  abbr:'T-FF', label:'T Flip-Flop',  fields:[{k:'clk_pin',t:'number',v:0}], hasIn:true, hasOut:true },
    { type:'set_reset',   abbr:'S/R',  label:'Set / Reset',  fields:[], hasIn:true, hasOut:true },
  ]},
  { section: 'Counters & Registers', colorKey: 'coral', nodes: [
    { type:'counter_up',      abbr:'CTU',  label:'Count Up',       fields:[{k:'preset',t:'number',v:10}], hasIn:true, hasOut:true },
    { type:'counter_down',    abbr:'CTD',  label:'Count Down',     fields:[{k:'preset',t:'number',v:10}], hasIn:true, hasOut:true },
    { type:'counter_updown',  abbr:'CTUD', label:'Count Up/Down',  fields:[{k:'preset',t:'number',v:10}], hasIn:true, hasOut:true },
    { type:'shift_register',  abbr:'SHR',  label:'Shift Register', fields:[{k:'bits',t:'number',v:8},{k:'clk_pin',t:'number',v:0}], hasIn:true, hasOut:true },
    { type:'ring_counter',    abbr:'RING', label:'Ring Counter',   fields:[{k:'stages',t:'number',v:4}], hasIn:true, hasOut:true },
  ]},
  { section: 'Timers', colorKey: 'teal', nodes: [
    { type:'timer_on',      abbr:'TON', label:'Timer ON Delay',  fields:[{k:'delay',t:'number',v:1.0}],   hasIn:true, hasOut:true },
    { type:'timer_off',     abbr:'TOF', label:'Timer OFF Delay', fields:[{k:'delay',t:'number',v:1.0}],   hasIn:true, hasOut:true },
    { type:'timer_pulse',   abbr:'TP',  label:'Pulse Timer',     fields:[{k:'pulse_s',t:'number',v:0.5}], hasIn:true, hasOut:true },
    { type:'debounce',      abbr:'DEB', label:'Debounce Filter', fields:[{k:'delay',t:'number',v:0.1}],   hasIn:true, hasOut:true },
    { type:'watchdog_timer',abbr:'WDT', label:'Watchdog Timer',  fields:[{k:'timeout',t:'number',v:5}],   hasIn:true, hasOut:true },
    { type:'rtc_node',      abbr:'RTC', label:'Real-Time Clock', fields:[{k:'trigger',t:'text',v:'HH:MM'}], hasIn:false, hasOut:true },
  ]},
  { section: 'Signal Processing', colorKey: 'amber', nodes: [
    { type:'threshold',      abbr:'THR', label:'Threshold',       fields:[{k:'op',t:'select',v:'>',opts:'>|<|>=|<=|==|!='},{k:'value',t:'number',v:50}], hasIn:true, hasOut:true },
    { type:'pid_controller', abbr:'PID', label:'PID Controller',  fields:[{k:'kp',t:'number',v:1},{k:'ki',t:'number',v:0.1},{k:'kd',t:'number',v:0.01},{k:'sp',t:'number',v:100}], hasIn:true, hasOut:true },
    { type:'scale_map',      abbr:'MAP', label:'Scale Map',       fields:[{k:'in_min',t:'number',v:0},{k:'in_max',t:'number',v:1023},{k:'out_min',t:'number',v:0},{k:'out_max',t:'number',v:100}], hasIn:true, hasOut:true },
    { type:'moving_average', abbr:'AVG', label:'Moving Average',  fields:[{k:'window',t:'number',v:10}], hasIn:true, hasOut:true },
    { type:'rate_of_change', abbr:'RoC', label:'Rate of Change',  fields:[{k:'threshold',t:'number',v:5}], hasIn:true, hasOut:true },
    { type:'hysteresis',     abbr:'HYS', label:'Hysteresis',      fields:[{k:'upper',t:'number',v:55},{k:'lower',t:'number',v:45}], hasIn:true, hasOut:true },
    { type:'low_pass',       abbr:'LPF', label:'Low-Pass Filter', fields:[{k:'cutoff_hz',t:'number',v:10}], hasIn:true, hasOut:true },
    { type:'high_pass',      abbr:'HPF', label:'High-Pass Filter',fields:[{k:'cutoff_hz',t:'number',v:10}], hasIn:true, hasOut:true },
  ]},
  { section: 'Math & Arithmetic', colorKey: 'green', nodes: [
    { type:'add_node',      abbr:'ADD',   label:'Add',            fields:[], hasIn:true, hasOut:true },
    { type:'subtract_node', abbr:'SUB',   label:'Subtract',       fields:[], hasIn:true, hasOut:true },
    { type:'multiply_node', abbr:'MUL',   label:'Multiply',       fields:[], hasIn:true, hasOut:true },
    { type:'divide_node',   abbr:'DIV',   label:'Divide',         fields:[], hasIn:true, hasOut:true },
    { type:'abs_node',      abbr:'ABS',   label:'Absolute Value', fields:[], hasIn:true, hasOut:true },
    { type:'modulo_node',   abbr:'MOD',   label:'Modulo',         fields:[{k:'divisor',t:'number',v:10}], hasIn:true, hasOut:true },
    { type:'comparator',    abbr:'CMP',   label:'Comparator',     fields:[{k:'op',t:'select',v:'>',opts:'>|<|>=|<=|==|!='}], hasIn:true, hasOut:true },
    { type:'mux_node',      abbr:'MUX',   label:'Multiplexer',    fields:[{k:'select',t:'number',v:0}], hasIn:true, hasOut:true },
    { type:'demux_node',    abbr:'DEMUX', label:'Demultiplexer',  fields:[{k:'select',t:'number',v:0}], hasIn:true, hasOut:true },
  ]},
  { section: 'Sensors', colorKey: 'blue', nodes: [
    { type:'temp_sensor',      abbr:'TMP', label:'Temperature',   fields:[{k:'type',t:'select',v:'DS18B20',opts:'DS18B20|PT100|NTC|DHT22'},{k:'pin',t:'number',v:4}], hasIn:false, hasOut:true },
    { type:'pressure_sensor',  abbr:'PRS', label:'Pressure',      fields:[{k:'pin',t:'number',v:0},{k:'range',t:'text',v:'0-10bar'}], hasIn:false, hasOut:true },
    { type:'flow_sensor',      abbr:'FLW', label:'Flow',          fields:[{k:'pin',t:'number',v:5},{k:'ppl',t:'number',v:450}], hasIn:false, hasOut:true },
    { type:'level_sensor',     abbr:'LVL', label:'Level',         fields:[{k:'type',t:'select',v:'ultrasonic',opts:'ultrasonic|float|capacitive'},{k:'pin',t:'number',v:6}], hasIn:false, hasOut:true },
    { type:'current_sensor',   abbr:'CUR', label:'Current (CT)',  fields:[{k:'pin',t:'number',v:1},{k:'ct_ratio',t:'number',v:100}], hasIn:false, hasOut:true },
    { type:'voltage_sensor',   abbr:'VLT', label:'Voltage',       fields:[{k:'pin',t:'number',v:2},{k:'divider',t:'number',v:11}], hasIn:false, hasOut:true },
    { type:'proximity_sensor', abbr:'PRX', label:'Proximity',     fields:[{k:'type',t:'select',v:'ultrasonic',opts:'ultrasonic|inductive|capacitive'},{k:'pin',t:'number',v:7}], hasIn:false, hasOut:true },
    { type:'encoder',          abbr:'ENC', label:'Encoder',       fields:[{k:'a_pin',t:'number',v:8},{k:'b_pin',t:'number',v:9},{k:'ppr',t:'number',v:600}], hasIn:false, hasOut:true },
    { type:'adc_node',         abbr:'ADC', label:'ADC (ADS1115)', fields:[{k:'addr',t:'text',v:'0x48'},{k:'ch',t:'number',v:0},{k:'gain',t:'number',v:1}], hasIn:false, hasOut:true },
  ]},
  { section: 'Protection & Safety', colorKey: 'red', nodes: [
    { type:'emergency_stop',       abbr:'ESTOP',label:'Emergency Stop',       fields:[{k:'pin',t:'number',v:2},{k:'nc',t:'select',v:'true',opts:'true|false'}], hasIn:false, hasOut:true },
    { type:'overcurrent_prot',     abbr:'OCP',  label:'Overcurrent Prot.',    fields:[{k:'trip_a',t:'number',v:10},{k:'delay_ms',t:'number',v:100}], hasIn:true, hasOut:true },
    { type:'interlock',            abbr:'ILK',  label:'Interlock',            fields:[], hasIn:true, hasOut:true },
    { type:'overtemp_protection',  abbr:'OTP',  label:'Overtemp Prot.',       fields:[{k:'trip_c',t:'number',v:85}], hasIn:true, hasOut:true },
    { type:'undervoltage_lockout', abbr:'UVLO', label:'Undervoltage Lockout', fields:[{k:'threshold',t:'number',v:10.5}], hasIn:true, hasOut:true },
    { type:'fault_latch',          abbr:'FLT',  label:'Fault Latch',          fields:[], hasIn:true, hasOut:true },
  ]},
  { section: 'HMI & Display', colorKey: 'amber', nodes: [
    { type:'lcd_i2c',      abbr:'LCD',  label:'LCD (I2C)',    fields:[{k:'addr',t:'text',v:'0x27'},{k:'msg',t:'text',v:'Hello'}], hasIn:true, hasOut:false },
    { type:'seven_seg',    abbr:'7SEG', label:'7-Segment',    fields:[{k:'clk',t:'number',v:11},{k:'dio',t:'number',v:12}], hasIn:true, hasOut:false },
    { type:'buzzer',       abbr:'BUZ',  label:'Buzzer',       fields:[{k:'pin',t:'number',v:13},{k:'freq',t:'number',v:1000},{k:'dur_ms',t:'number',v:200}], hasIn:true, hasOut:false },
    { type:'rgb_led',      abbr:'RGB',  label:'RGB LED',      fields:[{k:'r_pin',t:'number',v:14},{k:'g_pin',t:'number',v:15},{k:'b_pin',t:'number',v:16}], hasIn:true, hasOut:false },
    { type:'oled_display', abbr:'OLED', label:'OLED Display', fields:[{k:'addr',t:'text',v:'0x3C'}], hasIn:true, hasOut:false },
  ]},
];

// ─── Single draggable node chip ─────────────────────────────────────────────
function DraggableNode({ node, color, theme }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${node.type}`,
    data: { ...node, color },
  });

  const isDark = theme === 'dark';

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderRadius: 6, marginBottom: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.4 : 1,
        background: isDark ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid transparent`,
        transition: 'all 0.12s',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : color.bg;
        e.currentTarget.style.borderColor = color.bd;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* color chip / abbr badge */}
      <div style={{
        width: 30, height: 22, borderRadius: 4, flexShrink: 0,
        background: color.bg, border: `1px solid ${color.bd}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 8, fontWeight: 600, color: color.hd,
        fontFamily: 'monospace', letterSpacing: '0.02em',
      }}>
        {node.abbr}
      </div>
      <span style={{
        fontSize: 12, color: isDark ? '#d0d0d0' : '#333',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {node.label}
      </span>
    </div>
  );
}

// ─── Collapsible section ─────────────────────────────────────────────────────
function PaletteSection({ section, nodes, colorKey, theme, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const color = COLORS[colorKey];
  const isDark = theme === 'dark';

  return (
    <div style={{ marginBottom: 2 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#ececec'}`,
        }}
      >
        {/* section color dot */}
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color.hd, flexShrink: 0 }} />
        <span style={{
          flex: 1, fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: isDark ? '#aaa' : '#555',
        }}>
          {section}
        </span>
        <span style={{ fontSize: 10, color: isDark ? '#666' : '#aaa' }}>{nodes.length}</span>
        <ChevronRight size={13} style={{
          color: isDark ? '#666' : '#aaa',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.18s',
        }} />
      </button>

      {open && (
        <div style={{ padding: '4px 8px 6px' }}>
          {nodes.map(node => (
            <DraggableNode key={node.type} node={node} color={color} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────
const LowCodePanel = ({ isOpen, onClose, theme }) => {
  const [search, setSearch] = useState('');
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const q = search.toLowerCase().trim();
  const filtered = q
    ? PALETTE.map(sec => ({
        ...sec,
        nodes: sec.nodes.filter(n => n.label.toLowerCase().includes(q) || n.type.includes(q) || n.abbr.toLowerCase().includes(q)),
      })).filter(sec => sec.nodes.length > 0)
    : PALETTE;

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed', left: 60, top: 40,
        width: 300, height: 'calc(100vh - 40px)',
        backgroundColor: isDark ? '#1c1c1c' : '#fafafa',
        borderRight: `1px solid ${isDark ? '#2e2e2e' : '#e4e4e4'}`,
        boxShadow: '3px 0 12px rgba(0,0,0,0.12)',
        zIndex: 999, display: 'flex', flexDirection: 'column',
        animation: 'lcSlideIn 0.22s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        borderBottom: `1px solid ${isDark ? '#2e2e2e' : '#e4e4e4'}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#185FA5', flexShrink: 0,
        }} />
        <span style={{
          flex: 1, fontSize: 13, fontWeight: 600,
          color: isDark ? '#eee' : '#222',
        }}>
          Low Code Platform
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: isDark ? '#777' : '#999', borderRadius: 4,
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = isDark ? '#eee' : '#333'; e.currentTarget.style.background = isDark ? '#2a2a2a' : '#eee'; }}
          onMouseLeave={e => { e.currentTarget.style.color = isDark ? '#777' : '#999'; e.currentTarget.style.background = 'none'; }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? '#2a2a2a' : '#ebebeb'}` }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes..."
          style={{
            width: '100%', padding: '6px 10px', borderRadius: 6,
            border: `1px solid ${isDark ? '#383838' : '#ddd'}`,
            background: isDark ? '#252525' : '#fff',
            color: isDark ? '#ddd' : '#333', fontSize: 12, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Hint */}
      <div style={{
        padding: '5px 14px 4px',
        fontSize: 10, color: isDark ? '#555' : '#bbb',
        borderBottom: `1px solid ${isDark ? '#222' : '#f0f0f0'}`,
      }}>
        Drag a node onto the canvas to place it
      </div>

      {/* Node list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map((sec, i) => (
          <PaletteSection
            key={sec.section}
            section={sec.section}
            nodes={sec.nodes}
            colorKey={sec.colorKey}
            theme={theme}
            defaultOpen={i < 2}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: isDark ? '#555' : '#bbb', fontSize: 12 }}>
            No nodes match "{search}"
          </div>
        )}
      </div>

      <style>{`
        @keyframes lcSlideIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LowCodePanel;
