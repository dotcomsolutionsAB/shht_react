import Card from "./Card";
import Chip from "./Chip";
import Tabs from "./Tabs";
import Table from "./Table";
import Badge from "./Badge";
import Paper from "./Paper";
import Button from "./Button";
import SvgIcon from "./SvgIcon";
import Popover from "./Popover";
import Checkbox from "./Checkbox";
import Typography from "./Typography";
import CssBaseline from "./CssBaseline";
import ControlLabel from "./ControlLabel";
import TextField from "./TextField";
import DatePicker from "./DatePicker";

export default function ComponentsOverrides(theme) {
  return Object.assign(
    Badge(theme),
    Button(theme),
    Card(theme),
    Checkbox(theme),
    Chip(theme),
    ControlLabel(theme),
    CssBaseline(theme),
    DatePicker(theme),
    Paper(theme),
    Popover(theme),
    SvgIcon(theme),
    Table(theme),
    Tabs(theme),
    TextField(theme),
    Typography(theme)
  );
}
