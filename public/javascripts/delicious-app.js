import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autoComplte from "./modules/auto-complete";

autoComplte($("#address"), $("#latitude"), $("#longitude"));
