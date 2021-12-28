/* eslint-disable no-await-in-loop */
import cluster from 'cluster';
import { FrameworkEvent, Mux } from '@dkdao/framework';
import config from './helper/config';
import logger from './helper/logger';
import { IWoker, loadWorker } from './helper/utilities';
import './middleware';
import './mux';

FrameworkEvent.on('error', (e) => logger.error(e));

/**
 * Main application
 * @class MainApplication
 */
class MainApplication {
  /**
   * Start master
   * @private
   * @static
   * @memberof MainApplication
   */
  private static async startMaster() {
    logger.info(`Master ${process.pid} is running`);

    logger.debug(`Node running mode: ${config.nodeEnv}`);
    const workerMap: { [key: number]: IWoker } = {};
    const pidMap: { [key: number]: number } = {};

    function startWorker(worker: Partial<IWoker>) {
      // This block to isolate API loading
      const newCluster = loadWorker(worker);
      // Add to worker map
      workerMap[newCluster.pid] = newCluster;
      pidMap[newCluster.id] = newCluster.pid;
      logger.info(`${newCluster.name} was loaded at: ${newCluster.pid}`);
    }

    // API worker
    startWorker({
      name: 'api-1',
    });

    // API worker
    startWorker({
      name: 'api-2',
    });

    // Keep all workers alive
    cluster.on('exit', (worker: any, code: number, signal: number) => {
      const { id, name, pid } = worker.process.env;
      logger.info(`Worker pid: ${pid} name: ${name} died with code: ${code}, received: ${signal}`);
      // Respawn
      startWorker({ id, name, pid });
      // Remove old record
      delete workerMap[pid];
      delete pidMap[id];
    });
  }

  /**
   * Start gRPC service
   * @private
   * @static
   * @memberof MainApplication
   */
  private static startAPI() {
    logger.info(`Start API <${process.env.name}> service ${config.serviceHost}:${config.servicePort}`);
    Mux.init(config.servicePort, config.serviceHost, true);
  }

  /**
   * Application entry point
   * @static
   * @memberof MainApplication
   */
  public static async start() {
    if (cluster.isMaster) {
      MainApplication.startMaster();
    } else {
      MainApplication.startAPI();
    }
  }
}

MainApplication.start();
