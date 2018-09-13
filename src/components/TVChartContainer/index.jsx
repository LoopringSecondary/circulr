import * as React from 'react';
import './index.css';
import {connect} from "dva";
import historyProvider from "./api/historyProvider";

function getLanguageFromURL() {
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

class TVChartContainer extends React.PureComponent {

	state = {
    containerId: 'tv_chart_container',
	  barsLoaded: false
  }

  tvWidget = null;

  componentDidMount() {
    //const param = location.pathname.replace(`${match.path}/`, '')
    const symbol = window.location.hash.replace('#/trade/', '')
	  this.initChart(symbol)
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

	initChart(symbol) {
	  const _this = this
		const widgetOptions = {
			debug: true,
			symbol: symbol,
			datafeed: {
        onReady: cb => {
          console.log('=====onReady running')
          setTimeout(() => cb({
            supports_search: true,
            supports_group_request: false,
            supports_marks: true,
            exchanges: [],
            symbolsTypes: [],
            supported_resolutions: ["1", "15", "60", "240", "D"]
          }), 0)
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
          console.log('====Search Symbols running')
        },
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
          window.SYMBOLE_CHANGE = onSymbolResolvedCallback
          setTimeout(() => {
            onSymbolResolvedCallback({
              name: symbolName,
              ticker: symbolName,
              description: symbolName,
              has_intraday: true,
              timezone: 'Asia/Shanghai',
              minmov: '1',
              minmov2: 0,
              session: '24x7',
              pricescale: 1000000,
              has_no_volume: false,
              // expired: true,
              // expiration_date: 1527379200000
            })
          }, 0)
        },
        getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
          console.log('=====getBars running', _this.state.barsLoaded)
          // console.log('function args',arguments)
          // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
          if (_this.state.barsLoaded) {
            setTimeout(() => {
              onHistoryCallback([], {noData: true})
            }, 0)
          } else {
            historyProvider.getLoopringBars(symbolInfo, resolution, from, to, firstDataRequest)
              .then(bars => {
                console.log('...getLoopringBars...', from, to, bars)
                _this.setState({barsLoaded: true})
                if (bars.length) {
                  onHistoryCallback(bars, {noData: false})
                } else {
                  onHistoryCallback(bars, {noData: true})
                }
              }).catch(err => {
                console.log({err})
                onErrorCallback(err)
              })
          }
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
          console.log('=====subscribeBars runnning')
          window.TrendCallBack = onRealtimeCallback
          //TODO mock
          let time = 1536745511000
          setInterval(() => {
            const mock = {
              close:0.0012,
              high:0.004,
              //isBarClosed: true,
              //isLastBar: false,
              low:0.0011,
              open:0.0012,
              time:time,
              volume:12
            }
            time = time + 3600000
            //onRealtimeCallback(mock)
          }, 1000)
          //stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
        },
        unsubscribeBars: subscriberUID => {
          console.log('=====unsubscribeBars running')
          //stream.unsubscribeBars(subscriberUID)
        },
        getServerTime: cb => {
          console.log('=====getServerTime running')
        }
      },
      interval: '60',
      timeframe: '60',
      toolbar_bg: "#1d2337",
			container_id: this.state.containerId,
			library_path: '/charting_library/',
			locale: getLanguageFromURL() || 'en',
      disabled_features: [
        "use_localstorage_for_settings",
        "header_widget",
        "context_menus",
        "edit_buttons_in_legend",
        "border_around_the_chart",
        // "control_bar",
        "timeframes_toolbar",
        "left_toolbar"
      ],
			enabled_features: ['move_logo_to_main_pane'],
			charts_storage_url: 'https://saveload.tradingview.com',
			charts_storage_api_version: '1.1',
			client_id: 'tradingview.com',
			user_id: 'public_user_id',
			fullscreen: false,
			autosize:true,
			overrides: {
        "volumePaneSize": "large",
				"mainSeriesProperties.showCountdown": true,
				"paneProperties.background": "#08274c",
				"paneProperties.vertGridProperties.color": "#363c4e",
				"paneProperties.horzGridProperties.color": "#363c4e",
				"symbolWatermarkProperties.transparency": 90,
				"scalesProperties.textColor" : "#AAA",
				"mainSeriesProperties.candleStyle.wickUpColor": '#336854',
				"mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
        "paneProperties.topMargin": 20,
        "paneProperties.bottomMargin": 40,
			}
		};
    const tvWidget = new window.TradingView.widget(widgetOptions);
    this.tvWidget = tvWidget
    tvWidget.onChartReady(() => {
      console.log('Chart has loaded!', tvWidget)
    });
	}

	render() {
		return (
			<div
				id={ this.state.containerId }
				className={ 'TVChartContainer' }
			/>
		);
	}
}

function mapToProps(state) {
  return {
    trends:state.sockets.trends.items,
  }
}

export default (connect(mapToProps)(TVChartContainer));
